import { Module } from '@nestjs/common';
import { TelemetryManagementController } from './telemetry-management.controller';
import { RedqueenModule } from '@redqueen-backend/redqueen-data';

@Module({
  imports: [RedqueenModule],
  controllers: [TelemetryManagementController],
})
export class TelemetryManagementModule {}
