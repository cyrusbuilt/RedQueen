import { Module } from '@nestjs/common';
import { DeviceManagementController } from './device-management.controller';
import { RedqueenModule } from '@redqueen-backend/redqueen-data';

@Module({
  imports: [RedqueenModule],
  controllers: [DeviceManagementController],
})
export class DeviceManagementModule {}
