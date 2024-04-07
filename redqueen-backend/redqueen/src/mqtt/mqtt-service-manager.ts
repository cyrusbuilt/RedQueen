import { Inject, Injectable } from '@nestjs/common';
import {
  DeviceConfigDto,
  DeviceDto,
  MqttBroker,
  MqttTopic,
  RedQueenControlCommandDto,
  RedqueenService,
  RedqueenSystemStatusDto,
  Utils,
} from '@redqueen-backend/redqueen-data';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { MqttService } from './mqtt.service';
import { SystemStatus } from '../telemetry/system-status.enum';
import Configuration from '../configuration';
import { version } from '../../package.json';
import { ControlCommand } from '../telemetry/control-command.enum';
import { MqttMessageReceivedArgs } from '../events/mqtt-service-event-callbacks';

@Injectable()
export class MqttServiceManager {
  public instances: MqttService[];
  private _shouldStop: boolean;
  private _shouldRestart: boolean;
  private _systemStatus: SystemStatus;

  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
    private readonly redqueenDataService: RedqueenService,
  ) {
    this._shouldStop = false;
    this._shouldRestart = false;
    this.instances = [];
    this._systemStatus = SystemStatus.Shutdown;
  }

  public get shouldStop(): boolean {
    return this._shouldStop;
  }

  public get shouldRestart(): boolean {
    return this._shouldRestart;
  }

  public get systemStatus(): SystemStatus {
    return this._systemStatus;
  }

  private isDiscoverTopic(broker: MqttBroker, topicName: string): boolean {
    return (
      !Utils.isNullOrWhitespace(broker.discoveryTopic) &&
      topicName.toLowerCase().includes(broker.discoveryTopic.toLowerCase())
    );
  }

  private isControlTopic(topicName: string): boolean {
    return (
      !Utils.isNullOrWhitespace(topicName) &&
      !Utils.isNullOrWhitespace(Configuration.shared.daemonControlTopic) &&
      Configuration.shared.daemonControlTopic.toLowerCase() ===
        topicName.toLowerCase()
    );
  }

  private isDeviceConfig(obj: any): obj is DeviceConfigDto {
    return 'name' in obj && 'class' in obj && 'statusTopic' in obj;
  }

  private async processDeviceDiscovery(
    broker: MqttBroker,
    payload: string,
  ): Promise<void> {
    const parseResult = JSON.parse(payload);
    if (this.isDeviceConfig(parseResult)) {
      const device = parseResult as DeviceConfigDto;
      this.logger.info(`Discovered device: ${device.name}`);
      this.logger.info(`Attempting to save config for device: ${device.name}`);

      let statusTopic = await this.redqueenDataService.getTopic(
        device.statusTopic,
      );
      if (!statusTopic) {
        this.logger.warn(
          `Status topic not found: ${device.statusTopic}. Adding...`,
        );
        await this.redqueenDataService.saveTopic(device.statusTopic, broker.id);
      }

      let controlTopic: MqttTopic | null = null;
      if (!Utils.isNullOrWhitespace(device.controlTopic)) {
        controlTopic = await this.redqueenDataService.getTopic(
          device.controlTopic,
        );
        if (!controlTopic) {
          this.logger.warn(
            `Control topic not found: ${device.controlTopic}. Adding...`,
          );
          await this.redqueenDataService.saveTopic(
            device.controlTopic,
            broker.id,
          );
          controlTopic = await this.redqueenDataService.getTopic(
            device.controlTopic,
          );
        }
      }

      statusTopic = await this.redqueenDataService.getTopic(device.statusTopic);
      if (!statusTopic) {
        this.logger.error(
          `Unable to fetch or save status topic: ${device.statusTopic}. Cannot save device.`,
        );
        return;
      }

      const newDev = new DeviceDto();
      newDev.name = device.name;
      newDev.class = device.class;
      newDev.statusTopicId = statusTopic.id;
      newDev.controlTopicId = controlTopic?.id;

      const result = await this.redqueenDataService.addDevice(newDev);
      if (result) {
        this.logger.info('Device saved!');
        const serviceInstance = this.instances.find(
          (s) => s.host === broker.host,
        );
        if (serviceInstance) {
          await serviceInstance.subscribeTopic(statusTopic);
        } else {
          this.logger.warn(
            `Service instance for host ${broker.host} not found!`,
          );
        }
      } else {
        this.logger.warn(`Config for device already exists: ${device.name}`);
      }
    } else {
      this.logger.error('Failed to parse device JSON payload: ', payload);
    }
  }

  private async publishStatus(service: MqttService): Promise<void> {
    const stat: RedqueenSystemStatusDto = {
      timestamp: new Date(),
      status: this.systemStatus as number,
      daemonVersion: version,
    };

    const topic = Configuration.shared.daemonStatusTopic;
    await service.publishSystemStatus(stat, topic);
  }

  private isControlCommand(obj: any): obj is RedQueenControlCommandDto {
    return 'sender' in obj && 'command' in obj;
  }

  private async processControlMessage(
    payload: string,
    service: MqttService,
  ): Promise<void> {
    const result = JSON.parse(payload);
    if (this.isControlCommand(result)) {
      const cmd = result as RedQueenControlCommandDto;
      this.logger.info(`Received command from ${cmd.sender}: ${cmd.command}`);
      switch (cmd.command) {
        case ControlCommand.Restart as number:
          this.logger.warn('Restarting services...');
          this._systemStatus = SystemStatus.Restart;
          this._shouldRestart = true;
          await this.publishStatus(service);
          break;
        case ControlCommand.Shutdown as number:
          this.logger.warn('**** REDQUEEN SHUTTING DOWN ****');
          this._systemStatus = SystemStatus.Shutdown;
          this._shouldStop = true;
          await this.publishStatus(service);
          break;
        default:
          this.logger.warn(`Unrecognized command: ${cmd.command}`);
          break;
      }
    } else {
      this.logger.error(
        'Failed to parse JSON payload for control command: ',
        payload,
      );
    }
  }

  private async onMessageReceived(
    sender: any,
    evt: MqttMessageReceivedArgs,
  ): Promise<void> {
    const payload = evt.payload.toString();
    const topicName = evt.topic;

    let msg = `Message received: timestamp ${new Date().toUTCString()} | topic: ${topicName}`;
    msg += ` | QoS: ${evt.packet.qos} | broker: ${evt.host} | payload: ${payload}`;
    this.logger.info(msg);

    // If we got a message on the discovery topic, then process the discovered device.
    // Otherwise, save the payload as a message in the DB.
    const broker = await this.redqueenDataService.getBrokerByHost(evt.host);
    if (!broker) {
      this.logger.error(`MQTT broker not found: ${evt.host}!`);
      return;
    }

    if (this.isDiscoverTopic(broker, topicName)) {
      await this.processDeviceDiscovery(broker, payload);
    }

    if (this.isControlTopic(topicName)) {
      await this.processControlMessage(payload, sender as MqttService);
    }

    await this.redqueenDataService.saveTopic(topicName, broker.id);

    const topic = await this.redqueenDataService.getTopic(topicName);
    await this.redqueenDataService.saveMqttMessage(
      payload,
      topic.id,
      'REDQUEEN',
    );
  }

  public addService(service: MqttService): void {
    service.on('messageReceived', (sender: any, evt: MqttMessageReceivedArgs) =>
      this.onMessageReceived(sender, evt),
    );
    this.instances.push(service);
  }

  public async startAllServices(): Promise<number> {
    this._systemStatus = SystemStatus.Normal;
    let count = 0;
    for (const instance of this.instances) {
      this.logger.info(
        `Starting MQTT service handler for host: ${instance.host}`,
      );
      try {
        await instance.startPublisher();
        await instance.startSubscriber();
        await instance.subscribeAllTopics();
        await instance.subscribeSystemControlTopic(
          Configuration.shared.daemonControlTopic,
        );
        await this.publishStatus(instance);
        count++;
      } catch (e: any) {
        const msg = (e as Error).message;
        this.logger.error(
          `Failed to start publisher and/or subscriber for host: ${instance.host}: ${msg}`,
        );
      }

      try {
        this.logger.info(
          `Attempting to start auto-discover for host: ${instance.host}`,
        );
        await instance.startAutoDiscover();
        if (instance.autoDiscoverEnabled) {
          this.logger.info('Auto-discover running.');
        } else {
          this.logger.warn(
            'Auto-discover already running or topic not defined.',
          );
        }
      } catch (e: any) {
        const msg = (e as Error).message;
        this.logger.error(
          `Failed to start auto-discover for host: ${instance.host}: ${msg}`,
        );
      }
    }

    return count;
  }

  public async stopAllServices(): Promise<void> {
    for (const instance of this.instances) {
      this.logger.info(
        `Stopping MQTT service handler for host: ${instance.host}`,
      );
      await instance.dispose();
    }

    this._shouldRestart = false;
    this._systemStatus = SystemStatus.Shutdown;
  }

  public async startServiceForHost(host: string): Promise<void> {
    const svc = this.instances.find(
      (i) => i.host.toLowerCase() === host.toLowerCase(),
    );
    if (svc) {
      try {
        this.logger.info(`Starting MQTT service handler for host: ${svc.host}`);
        await svc.startPublisher();
        await svc.startSubscriber();
        await svc.subscribeAllTopics();
        await svc.subscribeSystemControlTopic(
          Configuration.shared.daemonControlTopic,
        );
        await this.publishStatus(svc);
      } catch (e: any) {
        const msg = (e as Error).message;
        this.logger.error(
          `Failed to start publisher and/or subscriber for host: ${svc.host}: ${msg}`,
        );
      }
    }
  }

  public async stopServiceForHost(host: string): Promise<void> {
    const svc = this.instances.find(
      (i) => i.host.toLowerCase() === host.toLowerCase(),
    );
    if (svc) {
      this.logger.info(`Stopping MQTT service handler for host: ${svc.host}`);
      await svc.dispose();
    }
  }
}
