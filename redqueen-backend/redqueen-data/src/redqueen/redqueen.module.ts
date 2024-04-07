import { Module } from '@nestjs/common';
import { RedqueenService } from './redqueen.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MqttBroker } from './entity/mqtt-broker.entity';
import { MqttTopic } from './entity/mqtt-topic.entity';
import { Device } from './entity/device.entity';
import { MqttMessage } from './entity/mqtt-message.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([MqttBroker, MqttTopic, Device, MqttMessage]),
  ],
  providers: [RedqueenService],
  exports: [RedqueenService],
})
export class RedqueenModule {}
