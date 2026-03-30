import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { NewsService } from '../services/news.service';
import { CreateNewsDto, UpdateNewsDto } from '../dtos/news.dto';

@Controller('api/news')
export class NewsController {
  constructor(private newsService: NewsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createNewsDto: CreateNewsDto) {
    return await this.newsService.create(createNewsDto);
  }

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('categoryId') categoryId?: string,
  ) {
    return await this.newsService.findAll(page, limit, categoryId);
  }

  @Get('featured/list')
  async getFeatured(@Query('limit') limit: number = 5) {
    return await this.newsService.findFeatured(limit);
  }

  @Get('recent/list')
  async getRecent(@Query('limit') limit: number = 10) {
    return await this.newsService.findRecent(limit);
  }

  @Get('search/query')
  async search(
    @Query('keyword') keyword: string,
    @Query('limit') limit: number = 20,
  ) {
    if (!keyword || keyword.trim().length === 0) {
      return { data: [], keyword };
    }
    const data = await this.newsService.search(keyword, limit);
    return { data, keyword };
  }

  @Get('slug/:slug')
  async findBySlug(@Param('slug') slug: string) {
    const news = await this.newsService.findBySlug(slug);
    await this.newsService.incrementViews(news.id);
    return news;
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.newsService.findById(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateNewsDto: UpdateNewsDto) {
    return await this.newsService.update(id, updateNewsDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    await this.newsService.delete(id);
  }

  @Put(':id/toggle-featured')
  async toggleFeatured(@Param('id') id: string) {
    return await this.newsService.toggleFeatured(id);
  }

  @Put(':id/toggle-active')
  async toggleActive(@Param('id') id: string) {
    return await this.newsService.toggleActive(id);
  }

  @Put(':id/views')
  async incrementViews(@Param('id') id: string) {
    return await this.newsService.incrementViews(id);
  }
}
