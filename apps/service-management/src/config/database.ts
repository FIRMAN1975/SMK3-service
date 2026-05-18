import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Guru } from '../modules/guru/guru.entity';
import { Siswa } from '../modules/siswa/siswa.entity';

export const getDatabaseConfig = (configService: ConfigService): TypeOrmModuleOptions => {
  const nodeEnv = configService.get<string>('NODE_ENV');
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
};
