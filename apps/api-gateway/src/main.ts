import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Gateway');

  // CORS — configurable via .env
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  const port = process.env.GATEWAY_PORT || 3000;
  await app.listen(port);

  logger.log(`🚀 Gateway running on http://localhost:${port}`);
  logger.log(`📡 CORS origin: ${process.env.CORS_ORIGIN || 'http://localhost:5173'}`);
  logger.log(`🔐 Keycloak issuer: ${process.env.KEYCLOAK_ISSUER}`);
}
bootstrap();
