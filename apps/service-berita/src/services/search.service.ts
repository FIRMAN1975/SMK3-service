import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { News } from '../entities/news.entity';
import { Announcement } from '../entities/announcement.entity';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(News)
    private newsRepository: Repository<News>,
    @InjectRepository(Announcement)
    private announcementRepository: Repository<Announcement>,
  ) {}

  async searchAll(
    keyword: string,
    limit: number = 20,
  ): Promise<{
    news: News[];
    announcements: Announcement[];
  }> {
    const [news, announcements] = await Promise.all([
      this.searchNews(keyword, limit),
      this.searchAnnouncements(keyword, limit),
    ]);

    return { news, announcements };
  }

  async searchNews(keyword: string, limit: number = 20): Promise<News[]> {
    return await this.newsRepository.find({
      where: [
        { title: Like(`%${keyword}%`), isActive: true },
        { content: Like(`%${keyword}%`), isActive: true },
        { excerpt: Like(`%${keyword}%`), isActive: true },
      ],
      order: { createdAt: 'DESC', views: 'DESC' },
      take: limit,
    });
  }

  async searchAnnouncements(
    keyword: string,
    limit: number = 20,
  ): Promise<Announcement[]> {
    return await this.announcementRepository.find({
      where: [
        { title: Like(`%${keyword}%`), isActive: true },
        { content: Like(`%${keyword}%`), isActive: true },
      ],
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }
}
