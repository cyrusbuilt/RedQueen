import { Inject, Injectable } from '@nestjs/common';
import { RedqueenService, Utils } from '@redqueen-backend/redqueen-data';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { MqttServiceManager } from './mqtt/mqtt-service-manager';
import { MqttService } from './mqtt/mqtt.service';
import Configuration from './configuration';
import { WeatherService } from './integrations/weather/weather.service';

@Injectable()
export class AppService {
  private weatherPollTimer: NodeJS.Timeout | null = null;

  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
    private readonly redqueenDataService: RedqueenService,
    private readonly mqttManager: MqttServiceManager,
    private readonly weatherService: WeatherService,
  ) {}

  private async reportWeather(): Promise<void> {
    this.logger.info(`Fetching current weather...`);
    const weather = await this.weatherService.getCurrentWeather(
      Configuration.shared.weatherLocLat,
      Configuration.shared.weatherLocLng,
    );
    await this.mqttManager.publishPayloadToTopic(
      JSON.stringify(weather),
      Configuration.shared.weatherTopic,
    );
  }

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

    if (!Utils.isNullOrWhitespace(Configuration.shared.weatherApiUrl)) {
      this.logger.info('Weather integration enabled.');
      this.logger.info(
        `Weather API base URL: ${Configuration.shared.weatherApiUrl}`,
      );

      if (!Utils.isNullOrWhitespace(Configuration.shared.weatherTopic)) {
        this.logger.info(
          `MQTT Weather topic: ${Configuration.shared.weatherTopic}`,
        );

        this.logger.info('Starting weather worker ...');
        this.weatherPollTimer = setInterval(this.reportWeather, 300000);
      }
    }
  }

  public async stop(): Promise<void> {
    this.logger.info('REDQUEEN is shutting down!');
    if (this.weatherPollTimer) {
      clearInterval(this.weatherPollTimer);
      this.weatherPollTimer = null;
    }

    await this.mqttManager.stopAllServices();
    this.mqttManager.instances = [];
  }
}
