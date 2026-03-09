import { NestFactory } from '@nestjs/core';
import { ServiceBeritaModule } from './service-berita.module';

async function bootstrap() {
  const app = await NestFactory.create(ServiceBeritaModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
