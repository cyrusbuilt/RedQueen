import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from '@redqueen-backend/redqueen-data';
import { PaginationModule } from '@redqueen-backend/redqueen-data';
import { RedqueenModule } from '@redqueen-backend/redqueen-data';
import { HistoricalDataModule } from '@redqueen-backend/redqueen-data';
import { CardModule } from '@redqueen-backend/redqueen-data';
import { WinstonModule } from 'nest-winston';
import winston from 'winston';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataContextBuilder } from '@redqueen-backend/redqueen-data';
import { CardManagementModule } from './card-management/card-management.module';
import { DeviceManagementModule } from './device-management/device-management.module';
import { HistoricalDataManagementModule } from './historical-data-management/historical-data-management.module';
import { TelemetryManagementModule } from './telemetry-management/telemetry-management.module';
import { UserManagementModule } from './user-management/user-management.module';
import Configuration from './configuration';

const dbContext = new DataContextBuilder()
  .setHost(Configuration.shared.dbHost)
  .setPort(Configuration.shared.dbPort)
  .setUsername(Configuration.shared.dbUser)
  .setPassword(Configuration.shared.dbPassword)
  .setDatabase(Configuration.shared.dbName)
  .build();

@Module({
  imports: [
    WinstonModule.forRoot({
      level: 'debug',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(
          (info) => `${info.timestamp} ${info.level}: ${info.message}`,
        ),
      ),
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'logs/server.log' }),
      ],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: dbContext.host,
      port: dbContext.port,
      username: dbContext.username,
      password: dbContext.password,
      database: dbContext.database,
      autoLoadEntities: true,
      synchronize: false,
      logging: true,
      logNotifications: true,
      installExtensions: true,
      verboseRetryLog: true,
      useUTC: false,
    }),
    AuthModule,
    UserModule,
    PaginationModule,
    RedqueenModule,
    HistoricalDataModule,
    CardModule,
    CardManagementModule,
    DeviceManagementModule,
    HistoricalDataManagementModule,
    TelemetryManagementModule,
    UserManagementModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
