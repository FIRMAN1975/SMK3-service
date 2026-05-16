import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThanOrEqual } from 'typeorm';
import { Schedule, ScheduleCategory } from '../entities/schedule.entity';
import { CreateScheduleDto, UpdateScheduleDto } from '../dtos';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule)
    private repo: Repository<Schedule>,
  ) {}

  private validateTimeRange(startTime?: string, endTime?: string) {
    if (startTime && endTime && endTime <= startTime) {
      throw new BadRequestException('Jam selesai harus lebih besar dari jam mulai');
    }
  }

  async create(dto: CreateScheduleDto): Promise<Schedule> {
    this.validateTimeRange(dto.startTime, dto.endTime);
    const entity = this.repo.create(dto);
    return this.repo.save(entity);
  }

  async findAll(page = 1, limit = 10, category?: ScheduleCategory) {
    limit = Math.min(limit, 50);

    const qb = this.repo
      .createQueryBuilder('s')
      .where('s.isActive = true');

    if (category) {
      qb.andWhere('s.category = :category', { category });
    }

    qb.orderBy('s.date', 'ASC');

    const [data, total] = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { data, total, page, limit };
  }

  async findOne(id: number): Promise<Schedule> {
    const data = await this.repo.findOne({ where: { id, isActive: true } });

    if (!data) {
      throw new NotFoundException(`Agenda ${id} tidak ditemukan atau telah dihapus`);
    }

    return data;
  }

  async update(id: number, dto: UpdateScheduleDto): Promise<Schedule> {
    const entity = await this.findOne(id);
    this.validateTimeRange(
      dto.startTime ?? entity.startTime,
      dto.endTime ?? entity.endTime,
    );

    Object.assign(entity, dto); // aman karena DTO sudah tervalidasi

    return this.repo.save(entity);
  }

  async remove(id: number): Promise<void> {
    const entity = await this.findOne(id);
    entity.isActive = false;
    await this.repo.save(entity);
  }

  async toggleActive(id: number): Promise<Schedule> {
    const entity = await this.findOne(id);
    entity.isActive = !entity.isActive;
    return this.repo.save(entity);
  }
}
