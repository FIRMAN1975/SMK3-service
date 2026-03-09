import { NestFactory } from '@nestjs/core';
import { ServiceManagementModule } from './service-management.module';

async function bootstrap() {
  const app = await NestFactory.create(ServiceManagementModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
