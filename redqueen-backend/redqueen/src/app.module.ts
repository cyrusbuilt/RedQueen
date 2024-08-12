import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import {
  DataContextBuilder,
  RedqueenModule,
} from '@redqueen-backend/redqueen-data';
import Configuration from './configuration';
import { WinstonModule } from 'nest-winston';
import winston from 'winston';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MqttModule } from './mqtt/mqtt.module';
import { WeatherModule } from './integrations/weather/weather.module';

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
        new winston.transports.File({ filename: 'logs/redqueen.log' }),
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
    RedqueenModule,
    MqttModule,
    WeatherModule,
  ],
  providers: [AppService],
  //exports: [AppService],
})
export class AppModule {}
