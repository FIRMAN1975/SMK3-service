import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets, LessThan } from 'typeorm';
import { Announcement, AnnouncementType } from '../entities/announcement.entity';
import { CreateAnnouncementDto, UpdateAnnouncementDto } from '../dtos';

@Injectable()
export class AnnouncementService {
  constructor(
    @InjectRepository(Announcement)
    private repo: Repository<Announcement>,
  ) {}

  async create(dto: CreateAnnouncementDto): Promise<Announcement> {
    const entity = this.repo.create({
      ...dto,
      title: dto.title.trim(),
      content: dto.content.trim(),
    });

    return this.repo.save(entity);
  }

  async findAll(page = 1, limit = 20, type?: AnnouncementType) {
    limit = Math.min(limit, 50);

    const qb = this.repo
      .createQueryBuilder('a')
      .where('a.isActive = true')
      .andWhere(
        new Brackets((qb) => {
          qb.where('a.expiredAt IS NULL').orWhere('a.expiredAt > :now', {
            now: new Date(),
          });
        }),
      );

    if (type) {
      qb.andWhere('a.type = :type', { type });
    }

    qb.orderBy('a.createdAt', 'DESC');

    const [data, total] = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { data, total, page, limit };
  }

  async findById(id: number): Promise<Announcement> {
    const data = await this.repo.findOne({ where: { id, isActive: true } });

    if (!data) {
      throw new NotFoundException(`Pengumuman ${id} tidak ditemukan`);
    }

    return data;
  }

  async update(id: number, dto: UpdateAnnouncementDto) {
    const entity = await this.findById(id);

    if (dto.title !== undefined) entity.title = dto.title.trim();
    if (dto.content !== undefined) entity.content = dto.content.trim();
    if (dto.description !== undefined) entity.description = dto.description;
    if (dto.imageUrl !== undefined) entity.imageUrl = dto.imageUrl;
    if (dto.type !== undefined) entity.type = dto.type;
    if (dto.author !== undefined) entity.author = dto.author;
    if (dto.isActive !== undefined) entity.isActive = dto.isActive;
    if (dto.expiredAt !== undefined)
      entity.expiredAt = new Date(dto.expiredAt);

    return this.repo.save(entity);
  }

  async delete(id: number): Promise<void> {
    const entity = await this.findById(id);
    entity.isActive = false;
    await this.repo.save(entity);
  }

  async toggleActive(id: number) {
    const entity = await this.findById(id);
    entity.isActive = !entity.isActive;
    return this.repo.save(entity);
  }

  async cleanExpired(): Promise<number> {
    const res = await this.repo.delete({
      expiredAt: LessThan(new Date()),
      isActive: true,
    });

    return res.affected ?? 0;
  }
}
