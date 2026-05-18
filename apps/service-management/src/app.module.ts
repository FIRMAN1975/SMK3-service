import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Guru, Siswa } from './entities';
import { GuruModule } from './modules/guru.module';
import { SiswaModule } from './modules/siswa.module';

@Module({
  imports: [
    // Baca .env dari root monorepo
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // TypeORM — sama polanya dengan service-berita
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const nodeEnv   = configService.get<string>('NODE_ENV');
        const forceSync = configService.get<string>('TYPEORM_SYNC') === 'true';
        const databaseUrl =
          configService.get<string>('DATABASE_URL') ||
          configService.get<string>('DB_MANAJEMEN_URL');

        if (!databaseUrl) {
          console.error('🔴 ERROR: DATABASE_URL atau DB_MANAJEMEN_URL wajib diisi');
          throw new Error('Missing DATABASE_URL or DB_MANAJEMEN_URL');
        }

        return {
          type: 'postgres',
          url: databaseUrl,
          entities: [Guru, Siswa],
          synchronize: forceSync || nodeEnv !== 'production',
          logging: nodeEnv !== 'production',
          dropSchema: false,
          poolSize: parseInt(configService.get<string>('DB_POOL_SIZE') || '10', 10),
          maxQueryExecutionTime: parseInt(
            configService.get<string>('DB_MAX_QUERY_TIME') || '30000',
            10,
          ),
          retryAttempts: parseInt(configService.get<string>('DB_RETRY_ATTEMPTS') || '3', 10),
          retryDelay: parseInt(configService.get<string>('DB_RETRY_DELAY') || '3000', 10),
        };
      },
    }),

    GuruModule,
    SiswaModule,
  ],
})
export class AppModule {}
