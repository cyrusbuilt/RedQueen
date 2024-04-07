import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { INestApplication, LoggerService } from '@nestjs/common';
import { AppService } from './app.service';

async function gracefulShutdown(
  logger: LoggerService,
  worker: AppService,
  app: INestApplication<any>,
) {
  logger.log(
    'Terminate signal caught or uncaught exception. Beginning shutdown...',
  );

  await worker.stop();
  app.close();
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = app.get(WINSTON_MODULE_NEST_PROVIDER) as LoggerService;
  app.useLogger(logger);
  const worker = app.get(AppService);
  process.on('SIGTERM', () => gracefulShutdown(logger, worker, app));
  //process.on('uncaughtException', () => gracefulShutdown(logger, worker, app));
  await worker.start();
  logger.log('REDQUEEN daemon is running!');
}

bootstrap();
