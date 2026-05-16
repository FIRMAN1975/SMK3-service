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
  ParseIntPipe,
} from '@nestjs/common';

import { NewsService } from '../services/news.service';
import { CreateNewsDto, UpdateNewsDto } from '../dtos/news.dto';

@Controller('berita')
export class BeritaController {
  constructor(private newsService: NewsService) {}

  // 🔓 semua role boleh baca
  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return await this.newsService.findAll(page, limit);
  }

  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    return await this.newsService.findById(id);
  }

  // 🔥 hanya ADMIN boleh create
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() body: CreateNewsDto) {
    return await this.newsService.create(body);
  }

  // 🔥 ADMIN + GURU boleh update
  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateNewsDto) {
    return await this.newsService.update(id, body);
  }

  // 🔥 hanya ADMIN boleh delete
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.newsService.delete(id);
  }
}
