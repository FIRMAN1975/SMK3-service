import { NestFactory } from '@nestjs/core';
import { ServicePortofolioModule } from './service-portofolio.module';

async function bootstrap() {
  const app = await NestFactory.create(ServicePortofolioModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
