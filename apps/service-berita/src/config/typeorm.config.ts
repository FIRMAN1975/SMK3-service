import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import {
  Category,
  News,
  Announcement,
  Contact,
  Schedule,
} from '../entities';

export const getTypeOrmConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  const env = configService.get<string>('NODE_ENV', 'development');

  return {
    type: 'postgres',
    // Gunakan properti 'url' dan ambil dari environment variable kamu
    url: configService.get<string>('DATABASE_URL_BERITA'),
    entities: [Category, News, Announcement, Contact, Schedule],
    synchronize: env === 'development',
    logging: env === 'development',
    dropSchema: false,
  };
};