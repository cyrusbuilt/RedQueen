import { Module } from '@nestjs/common';
import { UserManagementController } from './user-management.controller';
import { UserModule } from '@redqueen-backend/redqueen-data';

@Module({
  imports: [UserModule],
  controllers: [UserManagementController],
})
export class UserManagementModule {}
