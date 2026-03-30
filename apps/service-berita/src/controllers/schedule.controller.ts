import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ScheduleService } from '../services/schedule.service';
import { CreateScheduleDto, UpdateScheduleDto } from '../dtos/schedule.dto';
import { ScheduleCategory } from '../entities/schedule.entity';

@Controller('api/schedules')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createScheduleDto: CreateScheduleDto) {
    return this.scheduleService.create(createScheduleDto);
  }

  @Get()
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('category') category?: ScheduleCategory,
  ) {
    return this.scheduleService.findAll(page, limit, category);
  }

  @Get('upcoming')
  findUpcoming(@Query('days') days: number = 30) {
    return this.scheduleService.findUpcoming(days);
  }

  @Get('today')
  findToday() {
    return this.scheduleService.findToday();
  }

  @Get('by-month')
  findByMonth(
    @Query('month') month: number,
    @Query('year') year: number,
  ) {
    return this.scheduleService.findByMonth(month, year);
  }

  @Get('by-date')
  findByDate(@Query('date') date: string) {
    const parsedDate = new Date(date);
    return this.scheduleService.findByDate(parsedDate);
  }

  @Get('by-category/:category')
  findByCategory(@Param('category') category: ScheduleCategory) {
    return this.scheduleService.findByCategory(category);
  }

  @Get('statistics')
  getStatistics() {
    return this.scheduleService.getStatistics();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.scheduleService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateScheduleDto: UpdateScheduleDto,
  ) {
    return this.scheduleService.update(id, updateScheduleDto);
  }

  @Patch(':id/toggle-active')
  @HttpCode(HttpStatus.OK)
  toggleActive(@Param('id') id: string) {
    return this.scheduleService.toggleActive(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.scheduleService.remove(id);
  }
}
