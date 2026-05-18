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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

import { NewsService } from '../services/news.service';
import { CreateNewsDto, UpdateNewsDto } from '../dtos/news.dto';

// ── Konfigurasi penyimpanan file upload ───────────────────────────────────────
const storage = diskStorage({
  destination: './uploads',
  filename: (_, file, cb) =>
    cb(null, `${Date.now()}${extname(file.originalname)}`),
});

@Controller('berita')
export class BeritaController {
  constructor(private newsService: NewsService) {}

  // 🔓 Semua role boleh baca
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

  // 🔥 Hanya ADMIN boleh create
  // FileInterceptor('gambar') → key harus sama persis dengan FE (beritaApi.js: fd.append('gambar', ...))
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('gambar', { storage }))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: CreateNewsDto,
  ) {
    if (file) {
      // Simpan path relatif ke imageUrl agar bisa diakses via static file serving
      body.imageUrl = `/uploads/${file.filename}`;
    }
    return await this.newsService.create(body);
  }

  // 🔥 ADMIN + GURU boleh update
  @Put(':id')
  @UseInterceptors(FileInterceptor('gambar', { storage }))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: UpdateNewsDto,
  ) {
    if (file) {
      body.imageUrl = `/uploads/${file.filename}`;
    }
    return await this.newsService.update(id, body);
  }

  // 🔥 Hanya ADMIN boleh delete
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.newsService.delete(id);
  }
}