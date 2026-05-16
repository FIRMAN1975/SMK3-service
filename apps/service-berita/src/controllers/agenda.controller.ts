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
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ScheduleService } from '../services/schedule.service';
import { CreateScheduleDto, UpdateScheduleDto } from '../dtos/schedule.dto';
import { ScheduleCategory } from '../entities/schedule.entity';

@Controller('agenda')
export class AgendaController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Get()
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 100,
    @Query('category') category?: ScheduleCategory,
  ) {
    const result = await this.scheduleService.findAll(page, limit, category);
    return result;
  }

  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    return await this.scheduleService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateScheduleDto) {
    return await this.scheduleService.create(dto);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateScheduleDto,
  ) {
    return await this.scheduleService.update(id, dto);
  }

  @Put(':id/toggle-active')
  async toggleActive(@Param('id', ParseIntPipe) id: number) {
    return await this.scheduleService.toggleActive(id);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.scheduleService.remove(id);
    return { message: 'Agenda berhasil dihapus' };
  }
}