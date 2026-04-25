import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  // Global validation pipe agar semua DTO divalidasi otomatis
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,       // strip properti yang tidak ada di DTO
    forbidNonWhitelisted: false,
    transform: true,       // auto-transform tipe data (string -> number, dll)
  }));

  await app.listen(process.env.PORT ?? 3026);
  console.log(`Application is running on: http://localhost:3026`);
}
bootstrap();