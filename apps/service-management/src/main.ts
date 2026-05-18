import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // CORS
  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
  });

  // Sajikan folder uploads secara publik → http://localhost:PORT/uploads/namafile.pdf
  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads',
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      stopAtFirstError: true,
    }),
  );

  // Semua endpoint berada di bawah /api
  // → /api/management/guru, /api/management/siswa
  app.setGlobalPrefix('api');

  const port = process.env.PORT ?? process.env.SERVICE_MANAJEMEN_PORT ?? 3004;
  await app.listen(port, '0.0.0.0');
  console.log(`✅ Service Manajemen berjalan di http://localhost:${port}/api`);
  console.log(`📁 Uploads tersedia di http://localhost:${port}/uploads/`);
}
bootstrap();
