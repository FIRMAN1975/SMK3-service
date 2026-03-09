import { NestFactory } from '@nestjs/core';
import { ServicePelanggaranModule } from './service-pelanggaran.module';

async function bootstrap() {
  const app = await NestFactory.create(ServicePelanggaranModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
