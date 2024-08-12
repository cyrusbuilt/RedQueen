import {
  MqttBroker,
  MqttTopic,
  RedqueenSystemStatusDto,
  Utils,
} from '@redqueen-backend/redqueen-data';
import mqtt, {
  IConnackPacket,
  IDisconnectPacket,
  IPublishPacket,
  MqttClient,
} from 'mqtt';
import { Logger } from 'winston';
import {
  MqttMessageReceivedArgs,
  MqttServiceEventCallbacks,
} from '../events/mqtt-service-event-callbacks';
import { TypedEventEmitter } from '../events/event-emitter';

export class MqttService extends TypedEventEmitter<MqttServiceEventCallbacks> {
  private readonly _broker: MqttBroker;
  private readonly _host: string;
  private readonly _logger: Logger;
  private _autoDiscoverEnabled: boolean;
  private _isDisposed: boolean;
  private _clientPublisher?: MqttClient;
  private _clientSubscriber?: MqttClient;

  constructor(logger: Logger, broker: MqttBroker) {
    super();
    this._logger = logger;
    this._broker = broker;
    this._host = `mqtt://${this._broker.host}`;
    this._autoDiscoverEnabled = false;
    this._isDisposed = false;
  }

  public get host(): string {
    return this._host;
  }

  public get isDisposed(): boolean {
    return this._isDisposed;
  }

  public get autoDiscoverEnabled(): boolean {
    return this._autoDiscoverEnabled;
  }

  public getOptions(): mqtt.IClientOptions {
    const opts: mqtt.IClientOptions = {
      clientId: 'REDQUEEN',
      protocolVersion: 4,
      port: this._broker.port,
      clean: true,
      keepalive: this._broker.keepAliveSeconds || 5,
      protocolId: 'MQTT',
      username: this._broker.username,
      password: Buffer.from(this._broker.password),
    };
    return opts;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private onPublisherConnected(packet: IConnackPacket): void {
    this._logger.info('Publisher connected');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private onPublisherDisconnected(packet: IDisconnectPacket): void {
    this._logger.info('Publisher disconnected');
  }

  private onPublisherMessageReceived(
    topic: string,
    payload: Buffer,
    packet: IPublishPacket,
  ): void {
    const args: MqttMessageReceivedArgs = {
      topic: topic,
      payload: payload,
      packet: packet,
      host: this._host,
    };
    this.emit('messageReceived', this, args);
  }

  public async startPublisher(): Promise<void> {
    if (this._clientPublisher || this._isDisposed) {
      return;
    }

    const opts = this.getOptions();
    this._clientPublisher = await mqtt.connectAsync(this.host, opts);
    this._clientPublisher.on('connect', (packet: IConnackPacket) =>
      this.onPublisherConnected(packet),
    );
    this._clientPublisher.on('disconnect', (packet: IDisconnectPacket) =>
      this.onPublisherDisconnected(packet),
    );
    this._clientPublisher.on(
      'message',
      (topic: string, payload: Buffer, packet: IPublishPacket) =>
        this.onPublisherMessageReceived(topic, payload, packet),
    );
  }

  public async stopPublisher(): Promise<void> {
    if (!this._clientPublisher || this._isDisposed) {
      return;
    }

    this._clientPublisher.removeAllListeners();
    await this._clientPublisher.endAsync();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private onSubscriberConnected(packet: IConnackPacket): void {
    this._logger.info('Subscriber connected');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private onSubscriberDisconnected(packet: IDisconnectPacket): void {
    this._logger.info('Subscriber disconnected');
  }

  private onSubscriberMessageReceived(
    topic: string,
    payload: Buffer,
    packet: IPublishPacket,
  ): void {
    const args: MqttMessageReceivedArgs = {
      topic: topic,
      payload: payload,
      packet: packet,
      host: this._broker.host,
    };
    this.emit('messageReceived', this, args);
  }

  public async startSubscriber(): Promise<void> {
    if (this._clientSubscriber || this._isDisposed) {
      return;
    }

    const opts = this.getOptions();
    this._clientSubscriber = await mqtt.connectAsync(this.host, opts);
    this._clientSubscriber.on('connect', (packet: IConnackPacket) =>
      this.onSubscriberConnected(packet),
    );
    this._clientSubscriber.on('disconnect', (packet: IDisconnectPacket) =>
      this.onSubscriberDisconnected(packet),
    );
    this._clientSubscriber.on(
      'message',
      (topic: string, payload: Buffer, packet: IPublishPacket) =>
        this.onSubscriberMessageReceived(topic, payload, packet),
    );
  }

  public async stopSubscriber(): Promise<void> {
    if (!this._clientSubscriber || this._isDisposed) {
      return;
    }

    this._clientSubscriber.removeAllListeners();
    await this._clientSubscriber.endAsync();
  }

  public async subscribeTopic(topic: MqttTopic): Promise<void> {
    if (topic.isActive) {
      this._logger.info(`Subscribing topic: ${topic.name}`);
      await this._clientSubscriber.subscribeAsync(topic.name, {
        qos: 2,
      });
    }
  }

  public async subscribeAllTopics(): Promise<void> {
    console.log('topics:', this._broker.topics);
    for (const topic of this._broker.topics) {
      await this.subscribeTopic(topic);
    }
  }

  public async startAutoDiscover(): Promise<void> {
    if (this.autoDiscoverEnabled || this._isDisposed) {
      return;
    }

    if (Utils.isNullOrWhitespace(this._broker.discoveryTopic)) {
      this._logger.info(
        'No Auto-Discover topic defined. Skipping auto-discover.',
      );
      return;
    }

    this._logger.info(`Discovery topic: ${this._broker.discoveryTopic}`);
    const topic = new MqttTopic();
    topic.name = this._broker.discoveryTopic.trim();
    topic.brokerId = this._broker.id;
    topic.broker = this._broker;
    topic.createdDate = new Date();
    topic.isActive = true;

    await this.subscribeTopic(topic);
    this._autoDiscoverEnabled = true;
  }

  public async stopAutoDiscover(): Promise<void> {
    if (
      !this._autoDiscoverEnabled ||
      Utils.isNullOrWhitespace(this._broker.discoveryTopic) ||
      this._isDisposed
    ) {
      return;
    }

    await this._clientSubscriber.unsubscribeAsync(
      this._broker.discoveryTopic.trim(),
    );
    this._autoDiscoverEnabled = false;
  }

  public async publishPayloadToTopic(
    payload: any,
    topic: string,
  ): Promise<void> {
    const payloadStr = JSON.stringify(payload);
    this._logger.info(`Publishing payload: ${payload} to topic: ${topic} ...`);
    await this._clientPublisher.publishAsync(topic, payloadStr, {
      qos: 2,
      retain: true,
    });
  }

  public async publishSystemStatus(
    status: RedqueenSystemStatusDto,
    statusTopic: string,
  ): Promise<void> {
    return await this.publishPayloadToTopic(status, statusTopic);
  }

  public async subscribeSystemControlTopic(
    controlTopic: string,
  ): Promise<void> {
    const topic = new MqttTopic();
    topic.name = controlTopic;
    topic.broker = this._broker;
    topic.brokerId = this._broker.id;
    topic.createdDate = new Date();
    await this.subscribeTopic(topic);
  }

  public async dispose(): Promise<void> {
    if (this.isDisposed) {
      return;
    }

    await this.stopAutoDiscover();
    await this.stopPublisher();
    await this.stopSubscriber();
    this._isDisposed = true;
  }
}
