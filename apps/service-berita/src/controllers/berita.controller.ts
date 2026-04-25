import {
  Controller, Get, Post, Body, Param,
  Put, Delete, Query, HttpCode, HttpStatus,
  UseInterceptors, UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { NewsService } from '../services/news.service';
import { CreateNewsDto, UpdateNewsDto } from '../dtos/news.dto';

const storage = diskStorage({
  destination: (req, file, cb) => {
    const dir = './uploads';
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + extname(file.originalname));
  },
});

@Controller('api/berita')
export class BeritaController {
  constructor(private newsService: NewsService) {}

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const result = await this.newsService.findAll(page, limit);
    return result.data;
  }

  @Get(':id')
  async findById(@Param('id') id: number) {
    return await this.newsService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('gambar', { storage }))
  async create(
    @Body() body: any,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const dto: CreateNewsDto = {
      title: body.judul || body.title,
      content: body.isi || body.content || 'isi belum ada',
      excerpt: body.isi
        ? body.isi.substring(0, 150) + '...'
        : body.content?.substring(0, 150) + '...' || '',
      imageUrl: file
        ? `http://localhost:3003/uploads/${file.filename}`
        : body.gambar || body.imageUrl || '',
      author: body.author || 'Admin',
      isFeatured: false,
    };
    if (body.categoryId) dto.categoryId = Number(body.categoryId);
    return await this.newsService.create(dto);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('gambar', { storage }))
  async update(
    @Param('id') id: number,
    @Body() body: any,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const dto: UpdateNewsDto = {};
    if (body.judul || body.title) dto.title = body.judul || body.title;
    if (body.isi || body.content) dto.content = body.isi || body.content;
    if (file) dto.imageUrl = `http://localhost:3003/uploads/${file.filename}`;
    else if (body.gambar || body.imageUrl) dto.imageUrl = body.gambar || body.imageUrl;
    return await this.newsService.update(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    await this.newsService.delete(id);
    return { message: 'Berita berhasil dihapus' };
  }
}