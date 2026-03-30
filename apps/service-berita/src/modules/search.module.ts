import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { News } from '../entities/news.entity';
import { Announcement } from '../entities/announcement.entity';
import { SearchService } from '../services/search.service';
import { SearchController } from '../controllers/search.controller';

@Module({
  imports: [TypeOrmModule.forFeature([News, Announcement])],
  providers: [SearchService],
  controllers: [SearchController],
})
export class SearchModule {}
