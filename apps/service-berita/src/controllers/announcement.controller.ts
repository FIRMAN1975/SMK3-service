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
import { AnnouncementService } from '../services/announcement.service';
import {
  CreateAnnouncementDto,
  UpdateAnnouncementDto,
} from '../dtos/announcement.dto';
import { AnnouncementType } from '../entities/announcement.entity';

@Controller('api/announcements')
export class AnnouncementController {
  constructor(private announcementService: AnnouncementService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createAnnouncementDto: CreateAnnouncementDto) {
    return await this.announcementService.create(createAnnouncementDto);
  }

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Query('type') type?: AnnouncementType,
  ) {
    return await this.announcementService.findAll(page, limit, type);
  }

  @Get('type/:type')
  async findByType(
    @Param('type') type: AnnouncementType,
    @Query('limit') limit: number = 10,
  ) {
    return await this.announcementService.findByType(type, limit);
  }

  @Get('active/list')
  async findActive() {
    return await this.announcementService.findActive();
  }

  @Get('not-expired/list')
  async findNotExpired() {
    return await this.announcementService.findNotExpired();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.announcementService.findById(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAnnouncementDto: UpdateAnnouncementDto,
  ) {
    return await this.announcementService.update(id, updateAnnouncementDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    await this.announcementService.delete(id);
  }

  @Put(':id/toggle-active')
  async toggleActive(@Param('id') id: string) {
    return await this.announcementService.toggleActive(id);
  }

  @Post('clean-expired')
  async cleanExpired() {
    const affected = await this.announcementService.cleanExpiredAnnouncements();
    return { message: `${affected} pengumuman kadaluarsa dihapus`, affected };
  }
}
