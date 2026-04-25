import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  HttpCode,
  HttpStatus,
  BadRequestException,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { AnnouncementService } from '../services/announcement.service';
import { AnnouncementType } from '../entities/announcement.entity';

@Controller('api/pengumuman')
export class PengumumanController {
  constructor(private announcementService: AnnouncementService) {}

  // GET /api/pengumuman
  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 100,
  ) {
    const result = await this.announcementService.findAll(page, limit);
    return result.data.map(a => ({
      id: a.id,
      judul: a.title,
      title: a.title,
      isi: a.content,
      content: a.content,
      description: a.description,
      imageUrl: a.imageUrl,
      type: a.type,
      author: a.author,
      isActive: a.isActive,
      expiredAt: a.expiredAt,
      created_at: a.createdAt,
      createdAt: a.createdAt,
      updatedAt: a.updatedAt,
    }));
  }

  // GET /api/pengumuman/:id
  @Get(':id')
  async findById(@Param('id') id: number) {
    try {
      const a = await this.announcementService.findById(id);
      return {
        id: a.id,
        judul: a.title,
        title: a.title,
        isi: a.content,
        content: a.content,
        description: a.description,
        imageUrl: a.imageUrl,
        type: a.type,
        author: a.author,
        isActive: a.isActive,
        expiredAt: a.expiredAt,
        created_at: a.createdAt,
        createdAt: a.createdAt,
        updatedAt: a.updatedAt,
      };
    } catch (error) {
      throw new NotFoundException(`Pengumuman dengan ID ${id} tidak ditemukan`);
    }
  }

  // POST /api/pengumuman
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() body: any) {
    // Mendukung dua penamaan: judul (frontend) atau title (API standar)
    const title = body.judul || body.title;
    const content = body.isi || body.content || '';

    if (!title || String(title).trim().length === 0) {
      throw new BadRequestException('Judul pengumuman wajib diisi');
    }

    // Tentukan tipe pengumuman, default BIASA
    let type = AnnouncementType.BIASA;
    if (body.type) {
      const validTypes = Object.values(AnnouncementType);
      if (validTypes.includes(body.type)) {
        type = body.type;
      }
    }

    const ann = await this.announcementService.create({
      title: String(title).trim(),
      content: String(content),
      description: body.description || body.deskripsi || undefined,
      imageUrl: body.imageUrl || body.gambar || undefined,
      type: type,
      author: body.author || 'Admin',
      expiredAt: body.expiredAt || undefined,
    });

    return {
      id: ann.id,
      judul: ann.title,
      title: ann.title,
      isi: ann.content,
      content: ann.content,
      type: ann.type,
      author: ann.author,
      isActive: ann.isActive,
      created_at: ann.createdAt,
      createdAt: ann.createdAt,
    };
  }

  // PUT /api/pengumuman/:id
  @Put(':id')
  async update(@Param('id') id: number, @Body() body: any) {
    const dto: any = {};

    // Mendukung dua penamaan field
    const title = body.judul || body.title;
    const content =
      body.isi !== undefined
        ? body.isi
        : body.content !== undefined
          ? body.content
          : undefined;

    if (title !== undefined && title !== null) {
      dto.title = String(title).trim();
    }
    if (content !== undefined) {
      dto.content = String(content);
    }
    if (body.description !== undefined) dto.description = body.description;
    if (body.deskripsi !== undefined) dto.description = body.deskripsi;
    if (body.imageUrl !== undefined) dto.imageUrl = body.imageUrl;
    if (body.gambar !== undefined) dto.imageUrl = body.gambar;
    if (body.type !== undefined) dto.type = body.type;
    if (body.author !== undefined) dto.author = body.author;
    if (body.isActive !== undefined) dto.isActive = body.isActive;
    if (body.expiredAt !== undefined) dto.expiredAt = body.expiredAt;

    const ann = await this.announcementService.update(id, dto);

    return {
      id: ann.id,
      judul: ann.title,
      title: ann.title,
      isi: ann.content,
      content: ann.content,
      type: ann.type,
      author: ann.author,
      isActive: ann.isActive,
      created_at: ann.createdAt,
      createdAt: ann.createdAt,
      updatedAt: ann.updatedAt,
    };
  }

  // PUT /api/pengumuman/:id/toggle-active
  @Put(':id/toggle-active')
  async toggleActive(@Param('id') id: number) {
    const ann = await this.announcementService.toggleActive(id);
    return {
      id: ann.id,
      judul: ann.title,
      title: ann.title,
      isActive: ann.isActive,
      message: `Pengumuman berhasil ${ann.isActive ? 'diaktifkan' : 'dinonaktifkan'}`,
    };
  }

  // DELETE /api/pengumuman/:id
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: number) {
    await this.announcementService.delete(id);
    return { message: 'Pengumuman berhasil dihapus' };
  }
}