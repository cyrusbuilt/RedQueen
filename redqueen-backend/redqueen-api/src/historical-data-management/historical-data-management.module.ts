import { Module } from '@nestjs/common';
import { HistoricalDataManagementController } from './historical-data-management.controller';
import { HistoricalDataModule } from '@redqueen-backend/redqueen-data';

@Module({
  imports: [HistoricalDataModule],
  controllers: [HistoricalDataManagementController],
})
export class HistoricalDataManagementModule {}
