import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThanOrEqual } from 'typeorm';
import { Schedule, ScheduleCategory } from '../entities/schedule.entity';
import { CreateScheduleDto, UpdateScheduleDto } from '../dtos/schedule.dto';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
  ) {}

  async create(createScheduleDto: CreateScheduleDto): Promise<Schedule> {
    const schedule = this.scheduleRepository.create(createScheduleDto);
    return this.scheduleRepository.save(schedule);
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    category?: ScheduleCategory,
  ): Promise<{ data: Schedule[]; total: number; page: number; limit: number }> {
    const skip = (page - 1) * limit;

    const query = this.scheduleRepository
      .createQueryBuilder('schedule')
      .where('schedule.isActive = :isActive', { isActive: true })
      .orderBy('schedule.date', 'ASC')
      .addOrderBy('schedule.startTime', 'ASC');

    if (category) {
      query.andWhere('schedule.category = :category', { category });
    }

    const [data, total] = await query
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return { data, total, page, limit };
  }

  async findUpcoming(days: number = 30): Promise<Schedule[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const endDate = new Date(today);
    endDate.setDate(endDate.getDate() + days);

    return this.scheduleRepository.find({
      where: {
        date: Between(today, endDate),
        isActive: true,
      },
      order: {
        date: 'ASC',
        startTime: 'ASC',
      },
    });
  }

  async findToday(): Promise<Schedule[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return this.scheduleRepository.find({
      where: {
        date: Between(today, tomorrow),
        isActive: true,
      },
      order: {
        startTime: 'ASC',
      },
    });
  }

  async findByMonth(month: number, year: number): Promise<Schedule[]> {
    if (month < 1 || month > 12) {
      throw new BadRequestException('Bulan harus antara 1-12');
    }

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    return this.scheduleRepository.find({
      where: {
        date: Between(startDate, endDate),
        isActive: true,
      },
      order: {
        date: 'ASC',
        startTime: 'ASC',
      },
    });
  }

  async findByDate(date: Date): Promise<Schedule[]> {
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    return this.scheduleRepository.find({
      where: {
        date: Between(startDate, endDate),
        isActive: true,
      },
      order: {
        startTime: 'ASC',
      },
    });
  }

  async findByCategory(category: ScheduleCategory): Promise<Schedule[]> {
    return this.scheduleRepository.find({
      where: {
        category,
        isActive: true,
      },
      order: {
        date: 'ASC',
        startTime: 'ASC',
      },
    });
  }

  async findOne(id: number): Promise<Schedule> {
    const schedule = await this.scheduleRepository.findOne({
      where: { id },
    });

    if (!schedule) {
      throw new NotFoundException(`Agenda dengan ID ${id} tidak ditemukan`);
    }

    return schedule;
  }

  async update(id: number, updateScheduleDto: UpdateScheduleDto): Promise<Schedule> {
    const schedule = await this.findOne(id);

    Object.assign(schedule, updateScheduleDto);

    return this.scheduleRepository.save(schedule);
  }

  async remove(id: number): Promise<void> {
    const result = await this.scheduleRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Agenda dengan ID ${id} tidak ditemukan`);
    }
  }

  async toggleActive(id: number): Promise<Schedule> {
    const schedule = await this.findOne(id);

    schedule.isActive = !schedule.isActive;

    return this.scheduleRepository.save(schedule);
  }

  async getStatistics(): Promise<{
    total: number;
    byCategory: Record<string, number>;
    upcoming: number;
  }> {
    const total = await this.scheduleRepository.count();
    const upcoming = await this.scheduleRepository.count({
      where: {
        date: MoreThanOrEqual(new Date()),
        isActive: true,
      },
    });

    const byCategory: Record<string, number> = {};

    for (const category of Object.values(ScheduleCategory)) {
      byCategory[category] = await this.scheduleRepository.count({
        where: { category, isActive: true },
      });
    }

    return { total, byCategory, upcoming };
  }
}
