import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { News } from '../entities/news.entity';
import { CreateNewsDto, UpdateNewsDto } from '../dtos/news.dto';
import { CategoryService } from './category.service';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(News)
    private newsRepository: Repository<News>,
    private categoryService: CategoryService,
  ) {}

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  async create(createNewsDto: CreateNewsDto): Promise<News> {
    const news = new News();
    news.title = createNewsDto.title;
    news.content = createNewsDto.content;
    news.excerpt =
      createNewsDto.excerpt ||
      createNewsDto.content.substring(0, 150).trim() + '...';
    news.slug = this.generateSlug(createNewsDto.title);
    news.imageUrl = createNewsDto.imageUrl || '';
    news.author = createNewsDto.author || 'Admin';
    news.isFeatured = createNewsDto.isFeatured || false;

    // 🔥 FIX PENTING
    news.isActive = true;

    if (createNewsDto.categoryId) {
      news.category = await this.categoryService.findById(
        createNewsDto.categoryId,
      );
    }

    return await this.newsRepository.save(news);
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    categoryId?: string,
  ): Promise<{ data: News[]; total: number; page: number; limit: number }> {
    const query = this.newsRepository.createQueryBuilder('news');

    // 🔥 FIX: where dulu, baru andWhere
    query.where('news.isActive = :isActive', { isActive: true });

    if (categoryId) {
      query.andWhere('news.categoryId = :categoryId', { categoryId });
    }

    query.orderBy('news.createdAt', 'DESC');

    const total = await query.getCount();
    const data = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return { data, total, page, limit };
  }

  async findFeatured(limit: number = 5): Promise<News[]> {
    return await this.newsRepository.find({
      where: { isFeatured: true, isActive: true },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async findRecent(limit: number = 10): Promise<News[]> {
    return await this.newsRepository.find({
      where: { isActive: true },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async findById(id: number): Promise<News> {
    const news = await this.newsRepository.findOne({
      where: { id },
      relations: ['category'],
    });

    if (!news) {
      throw new NotFoundException(`Berita dengan ID ${id} tidak ditemukan`);
    }

    return news;
  }

  async findBySlug(slug: string): Promise<News> {
    const news = await this.newsRepository.findOne({
      where: { slug, isActive: true },
      relations: ['category'],
    });

    if (!news) {
      throw new NotFoundException(
        `Berita dengan slug ${slug} tidak ditemukan`,
      );
    }

    return news;
  }

  async search(keyword: string, limit: number = 20): Promise<News[]> {
    return await this.newsRepository.find({
      where: [
        { title: Like(`%${keyword}%`), isActive: true },
        { content: Like(`%${keyword}%`), isActive: true },
      ],
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async update(id: number, updateNewsDto: UpdateNewsDto): Promise<News> {
    const news = await this.findById(id);

    if (updateNewsDto.title) {
      news.title = updateNewsDto.title;
      news.slug = this.generateSlug(updateNewsDto.title);
    }

    if (updateNewsDto.content) {
      news.content = updateNewsDto.content;
    }

    if (updateNewsDto.excerpt) {
      news.excerpt = updateNewsDto.excerpt;
    }

    if (updateNewsDto.imageUrl) {
      news.imageUrl = updateNewsDto.imageUrl;
    }

    if (updateNewsDto.author) {
      news.author = updateNewsDto.author;
    }

    if (updateNewsDto.isFeatured !== undefined) {
      news.isFeatured = updateNewsDto.isFeatured;
    }

    if (updateNewsDto.isActive !== undefined) {
      news.isActive = updateNewsDto.isActive;
    }

    if (updateNewsDto.categoryId) {
      news.category = await this.categoryService.findById(
        updateNewsDto.categoryId,
      );
    }

    return await this.newsRepository.save(news);
  }

  async delete(id: number): Promise<void> {
    const news = await this.findById(id);
    await this.newsRepository.remove(news);
  }

  async incrementViews(id: number): Promise<News> {
    const news = await this.findById(id);
    news.views += 1;
    return await this.newsRepository.save(news);
  }

  async toggleFeatured(id: number): Promise<News> {
    const news = await this.findById(id);
    news.isFeatured = !news.isFeatured;
    return await this.newsRepository.save(news);
  }

  async toggleActive(id: number): Promise<News> {
    const news = await this.findById(id);
    news.isActive = !news.isActive;
    return await this.newsRepository.save(news);
  }
}