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
import { ScheduleService } from '../services/schedule.service';
import { ScheduleCategory } from '../entities/schedule.entity';

@Controller('api/agenda')
export class AgendaController {
  constructor(private scheduleService: ScheduleService) {}

  // GET /api/agenda
  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 100,
    @Query('category') category?: ScheduleCategory,
  ) {
    const result = await this.scheduleService.findAll(page, limit, category);
    return result.data.map(s => ({
      id: s.id,
      judul: s.title,
      title: s.title,
      deskripsi: s.description,
      description: s.description,
      tanggal: s.date,
      date: s.date,
      startTime: s.startTime,
      endTime: s.endTime,
      lokasi: s.location,
      location: s.location,
      participants: s.participants,
      category: s.category,
      imageUrl: s.imageUrl,
      isActive: s.isActive,
      created_at: s.createdAt,
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
    }));
  }

  // GET /api/agenda/:id
  @Get(':id')
  async findById(@Param('id') id: number) {
    try {
      const s = await this.scheduleService.findOne(id);
      return {
        id: s.id,
        judul: s.title,
        title: s.title,
        deskripsi: s.description,
        description: s.description,
        tanggal: s.date,
        date: s.date,
        startTime: s.startTime,
        endTime: s.endTime,
        lokasi: s.location,
        location: s.location,
        participants: s.participants,
        category: s.category,
        imageUrl: s.imageUrl,
        isActive: s.isActive,
        created_at: s.createdAt,
        createdAt: s.createdAt,
        updatedAt: s.updatedAt,
      };
    } catch (error) {
      throw new NotFoundException(`Agenda dengan ID ${id} tidak ditemukan`);
    }
  }

  // POST /api/agenda
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() body: any) {
    // Mendukung dua penamaan: judul (frontend) atau title (API standar)
    const title = body.judul || body.title;
    const tanggal = body.tanggal || body.date;

    if (!title || String(title).trim().length === 0) {
      throw new BadRequestException('Judul agenda wajib diisi');
    }

    if (!tanggal) {
      throw new BadRequestException('Tanggal agenda wajib diisi');
    }

    // Validasi dan konversi tanggal
    const parsedDate = new Date(tanggal);
    if (isNaN(parsedDate.getTime())) {
      throw new BadRequestException('Format tanggal tidak valid, gunakan format YYYY-MM-DD');
    }

    // Validasi kategori, default KEGIATAN
    let category = ScheduleCategory.KEGIATAN;
    if (body.category) {
      const validCategories = Object.values(ScheduleCategory);
      if (validCategories.includes(body.category)) {
        category = body.category;
      }
    }

    const schedule = await this.scheduleService.create({
      title: String(title).trim(),
      date: parsedDate,
      location: body.lokasi || body.location || '',
      description: body.deskripsi || body.description || '',
      startTime: body.startTime || null,
      endTime: body.endTime || null,
      participants: body.participants || '',
      category: category,
      imageUrl: body.imageUrl || '',
    });

    return {
      id: schedule.id,
      judul: schedule.title,
      title: schedule.title,
      deskripsi: schedule.description,
      description: schedule.description,
      tanggal: schedule.date,
      date: schedule.date,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      lokasi: schedule.location,
      location: schedule.location,
      participants: schedule.participants,
      category: schedule.category,
      isActive: schedule.isActive,
      created_at: schedule.createdAt,
      createdAt: schedule.createdAt,
    };
  }

  // PUT /api/agenda/:id
  @Put(':id')
  async update(@Param('id') id: number, @Body() body: any) {
    const dto: any = {};

    // Mendukung dua penamaan field
    const title = body.judul || body.title;
    const tanggal = body.tanggal || body.date;

    if (title !== undefined && title !== null && String(title).trim().length > 0) {
      dto.title = String(title).trim();
    }
    if (tanggal !== undefined) {
      const parsedDate = new Date(tanggal);
      if (!isNaN(parsedDate.getTime())) {
        dto.date = parsedDate;
      }
    }
    if (body.lokasi !== undefined) dto.location = body.lokasi;
    if (body.location !== undefined) dto.location = body.location;
    if (body.deskripsi !== undefined) dto.description = body.deskripsi;
    if (body.description !== undefined) dto.description = body.description;
    if (body.startTime !== undefined) dto.startTime = body.startTime;
    if (body.endTime !== undefined) dto.endTime = body.endTime;
    if (body.participants !== undefined) dto.participants = body.participants;
    if (body.category !== undefined) dto.category = body.category;
    if (body.imageUrl !== undefined) dto.imageUrl = body.imageUrl;
    if (body.isActive !== undefined) dto.isActive = body.isActive;

    const schedule = await this.scheduleService.update(id, dto);

    return {
      id: schedule.id,
      judul: schedule.title,
      title: schedule.title,
      deskripsi: schedule.description,
      description: schedule.description,
      tanggal: schedule.date,
      date: schedule.date,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      lokasi: schedule.location,
      location: schedule.location,
      participants: schedule.participants,
      category: schedule.category,
      isActive: schedule.isActive,
      created_at: schedule.createdAt,
      createdAt: schedule.createdAt,
      updatedAt: schedule.updatedAt,
    };
  }

  // PUT /api/agenda/:id/toggle-active
  @Put(':id/toggle-active')
  async toggleActive(@Param('id') id: number) {
    const schedule = await this.scheduleService.toggleActive(id);
    return {
      id: schedule.id,
      judul: schedule.title,
      title: schedule.title,
      isActive: schedule.isActive,
      message: `Agenda berhasil ${schedule.isActive ? 'diaktifkan' : 'dinonaktifkan'}`,
    };
  }

  // DELETE /api/agenda/:id
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: number) {
    await this.scheduleService.remove(id);
    return { message: 'Agenda berhasil dihapus' };
  }
}