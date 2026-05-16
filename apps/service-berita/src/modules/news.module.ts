import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { News } from '../entities/news.entity';
import { NewsService } from '../services/news.service';
import { BeritaController } from '../controllers/berita.controller';
import { CategoryModule } from '../modules/category.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([News]),
    CategoryModule, // ✅ WAJIB
  ],
  providers: [NewsService],
  controllers: [BeritaController],
})
export class NewsModule {}