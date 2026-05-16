import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { News } from '../entities/news.entity';
import { Announcement } from '../entities/announcement.entity';
import { SearchService } from '../services/search.service';
import { SearchController } from '../controllers/search.controller';
import { NewsModule } from './news.module';
import { AnnouncementModule } from './announcement.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([News, Announcement]),
    NewsModule,          // 🔥 BEST PRACTICE
    AnnouncementModule,  // 🔥 BEST PRACTICE
  ],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}