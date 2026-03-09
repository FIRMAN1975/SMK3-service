import { NestFactory } from '@nestjs/core';
import { ServiceProfileModule } from './service-profile.module';

async function bootstrap() {
  const app = await NestFactory.create(ServiceProfileModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
