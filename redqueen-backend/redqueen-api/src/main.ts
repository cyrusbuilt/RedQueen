import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import Configuration from './configuration';
import { NestExpressApplication } from '@nestjs/platform-express';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { LoggerService } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { version } from '../package.json';
import helmet from 'helmet';

async function gracefulShutdown(logger: LoggerService) {
  logger.log(
    'Terminate signal caught or uncaught exception. Beginning shutdown...',
  );

  // TODO any additional tear-down

  process.exit();
}

async function bootstrap() {
  const port = Configuration.shared.serverPort || 8080;
  const isProduction = process.env.NODE_ENV === 'production';
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    abortOnError: false,
  });
  const logger = app.get(WINSTON_MODULE_NEST_PROVIDER) as LoggerService;
  const config = new DocumentBuilder()
    .setTitle('RedQueen API')
    .setDescription('Provides an API for interracting with RedQueen data')
    .setVersion(version)
    .addTag('redqueen')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/documentation', app, document);

  app.useLogger(logger);
  app.enableCors();
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: { 'default-src': ['*'] },
      },
    }),
  );

  await app.listen(port, () => {
    process.on('SIGTERM', () => gracefulShutdown(logger));
    if (isProduction) {
      process.on('uncaughtException', () => gracefulShutdown(logger));
    }

    logger.log(`Server listing on port ${port}`);
  });
}

bootstrap();
