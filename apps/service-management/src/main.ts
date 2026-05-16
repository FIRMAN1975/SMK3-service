import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { mkdirSync } from 'fs';
import { join } from 'path';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/http-exception.filter';
import { formatValidationErrors } from './common/validation';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  mkdirSync(join(process.cwd(), 'uploads'), { recursive: true });
  mkdirSync(join(process.cwd(), 'uploads', 'service-management'), {
    recursive: true,
  });

  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
  });

  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      stopAtFirstError: true,
      exceptionFactory: (errors) => {
        const message = formatValidationErrors(errors);
        return new BadRequestException(message);
      },
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());

  const port =
    process.env.PORT ?? process.env.SERVICE_MANAGEMENT_PORT ?? '3005';
  await app.listen(port, '0.0.0.0');
  console.log(`✅ Service Management running on http://localhost:${port}`);
}

bootstrap();