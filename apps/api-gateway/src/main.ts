import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Gateway');



  const port = process.env.GATEWAY_PORT || 3000;
  await app.listen(port);

  logger.log(`🚀 Gateway running on http://localhost:${port}`);
  logger.log(`📡 CORS dihandle oleh Nginx`);
  logger.log(`🔐 Keycloak issuer: ${process.env.KEYCLOAK_ISSUER}`);
}
bootstrap();