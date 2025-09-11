/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './utils/http-exception-filter';
import { YoutubeController } from './modules/youtube/youtube.controller';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const yt = app.get(YoutubeController);
  const r = await yt.getComments({
    videoUrl: 'https://www.youtube.com/watch?v=VRhuKMQz700&pp=ugUEEgJydQ%3D%3D',
    categoryId: '851ba453-d779-42ed-b697-2bee332f0b9a',
  });

  console.log(r);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
    })
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:5173',
      'http://192.168.1.170:5173',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept, Authorization',
    credentials: true,
  });
  const port = process.env.PORT || 3002;

  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
