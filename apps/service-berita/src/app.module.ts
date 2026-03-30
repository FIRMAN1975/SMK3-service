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
} from './entities';
import { CategoryModule } from './modules/category.module';
import { NewsModule } from './modules/news.module';
import { AnnouncementModule } from './modules/announcement.module';
import { ContactModule } from './modules/contact.module';
import { SearchModule } from './modules/search.module';
import { ScheduleModule } from './modules/schedule.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_DATABASE || 'berita_sekolah',
      entities: [Category, News, Announcement, Contact, Schedule],
      synchronize: process.env.NODE_ENV === 'development',
      logging: process.env.NODE_ENV === 'development',
      dropSchema: false,
    }),
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
