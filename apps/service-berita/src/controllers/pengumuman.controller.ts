import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { AnnouncementService } from '../services/announcement.service';
import {
  CreateAnnouncementDto,
  UpdateAnnouncementDto,
} from '../dtos/announcement.dto';

@Controller('pengumuman')
export class PengumumanController {
  constructor(private readonly service: AnnouncementService) {}

  @Get()
  async findAll(@Query('page') page = 1, @Query('limit') limit = 100) {
    return await this.service.findAll(page, limit);
  }

  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    return await this.service.findById(id);
  }

  @Post()
  async create(@Body() dto: CreateAnnouncementDto) {
    return await this.service.create(dto);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAnnouncementDto,
  ) {
    return await this.service.update(id, dto);
  }

  @Put(':id/toggle-active')
  async toggleActive(@Param('id', ParseIntPipe) id: number) {
    return await this.service.toggleActive(id);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.service.delete(id);
    return { message: 'Pengumuman dihapus' };
  }
}