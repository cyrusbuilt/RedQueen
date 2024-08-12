import { Module } from '@nestjs/common';
import { MqttServiceManager } from './mqtt-service-manager';
import { RedqueenModule } from '@redqueen-backend/redqueen-data';

@Module({
  imports: [RedqueenModule],
  providers: [MqttServiceManager],
  exports: [MqttServiceManager],
})
export class MqttModule {}
