import { Module } from '@nestjs/common';
import { CardModule } from '@redqueen-backend/redqueen-data';
import { CardManagementController } from './card-management.controller';

@Module({
  imports: [CardModule],
  controllers: [CardManagementController],
})
export class CardManagementModule {}
