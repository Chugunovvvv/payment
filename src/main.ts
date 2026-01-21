import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';

import { AppModule } from './app.module';
import { getCorsConfig } from './config';
import { getSwaggerConfig } from './config/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);
  const logger = new Logger(AppModule.name);

  app.use(cookieParser(config.getOrThrow<string>('COOKIE_SECRET')));
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors(getCorsConfig(config));

  const swaggerConfig = getSwaggerConfig();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('/api_docs', app, swaggerDocument, {
    jsonDocumentUrl: 'openapi-json',
  });

  const port = config.getOrThrow<number>('HTTP_PORT');
  const host = config.getOrThrow<string>('HTTP_HOST');
  try {
    await app.listen(port);

    logger.log(`Application is running on: ${host}`);
  } catch (error) {
    logger.error('Error starting server:', error);
    process.exit(1);
  }
}
bootstrap();
