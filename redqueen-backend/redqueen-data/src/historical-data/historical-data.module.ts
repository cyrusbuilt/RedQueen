import { Module } from '@nestjs/common';
import { HistoricalDataService } from './historical-data.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MqttMessage } from '../redqueen/entity/mqtt-message.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MqttMessage])],
  providers: [HistoricalDataService],
  exports: [HistoricalDataService],
})
export class HistoricalDataModule {}
