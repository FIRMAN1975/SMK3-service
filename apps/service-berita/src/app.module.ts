import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  Category,
  News,
  Announcement,
  Contact,
  Schedule,
  User,
} from './entities';
import { CategoryModule } from './modules/category.module';
import { NewsModule } from './modules/news.module';
import { AnnouncementModule } from './modules/announcement.module';
import { ContactModule } from './modules/contact.module';
import { SearchModule } from './modules/search.module';
import { ScheduleModule } from './modules/schedule.module';
import { AuthModule } from './modules/auth.module';

@Module({
  imports: [
    // 1. Arahkan pembacaan .env ke folder root monorepo
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env', // Pastikan jumlah '../' menunjuk ke root tempat .env berada
    }),

    // 2. Gunakan forRootAsync agar TypeORM menunggu ConfigModule selesai bekerja
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        // Gunakan variabel DATABASE_URL_BERITA yang sudah sangat rapi di .env kamu
        url: configService.get<string>('DATABASE_URL_BERITA'),
        entities: [Category, News, Announcement, Contact, Schedule, User],
        synchronize: configService.get<string>('NODE_ENV') !== 'production', // Amankan produksi
        logging: configService.get<string>('NODE_ENV') !== 'production',
        dropSchema: false,
      }),
    }),

    AuthModule,
    CategoryModule,
    NewsModule,
    AnnouncementModule,
    ContactModule,
    SearchModule,
    ScheduleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}