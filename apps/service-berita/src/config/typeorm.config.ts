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
    host: configService.get<string>('DB_HOST', 'localhost'),
    port: configService.get<number>('DB_PORT', 5432),
    username: configService.get<string>('DB_USERNAME', 'postgres'),
    password: configService.get<string>('DB_PASSWORD', 'password'),
    database: configService.get<string>('DB_DATABASE', 'berita_sekolah'),
    entities: [Category, News, Announcement, Contact, Schedule],
    synchronize: env === 'development',
    logging: env === 'development',
    dropSchema: false,
  };
};
