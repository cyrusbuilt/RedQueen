import { Inject, Injectable } from '@nestjs/common';
import { RedqueenService } from '@redqueen-backend/redqueen-data';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { MqttServiceManager } from './mqtt/mqtt-service-manager';
import { MqttService } from './mqtt/mqtt.service';

@Injectable()
export class AppService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
    private readonly redqueenDataService: RedqueenService,
    private readonly mqttManager: MqttServiceManager,
  ) {}

  public async start(): Promise<void> {
    this.logger.info('REDQUEEN starting up!');
    this.logger.info('Fetching MQTT brokers...');
    const brokers = await this.redqueenDataService.getMqttBrokers(true);

    this.logger.info(`Retrieved ${brokers.length} MQTT brokers.`);
    for (const x of brokers) {
      this.logger.info(
        `Topic count for broker (${x.host}): ${x.topics.length}`,
      );
      this.mqttManager.addService(new MqttService(this.logger, x));
    }

    const result = await this.mqttManager.startAllServices();
    this.logger.info(`Started ${result} MQTT service instances.`);
  }

  public async stop(): Promise<void> {
    this.logger.info('REDQUEEN is shutting down!');
    await this.mqttManager.stopAllServices();
    this.mqttManager.instances = [];
  }
}
