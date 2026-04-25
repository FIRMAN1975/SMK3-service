import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Announcement, AnnouncementType } from '../entities/announcement.entity';
import {
  CreateAnnouncementDto,
  UpdateAnnouncementDto,
} from '../dtos/announcement.dto';

@Injectable()
export class AnnouncementService {
  constructor(
    @InjectRepository(Announcement)
    private announcementRepository: Repository<Announcement>,
  ) {}

  async create(createAnnouncementDto: CreateAnnouncementDto): Promise<Announcement> {
    const announcement = this.announcementRepository.create(
      createAnnouncementDto,
    );
    return await this.announcementRepository.save(announcement);
  }

  async findAll(
    page: number = 1,
    limit: number = 20,
    type?: AnnouncementType,
  ): Promise<{
    data: Announcement[];
    total: number;
    page: number;
    limit: number;
  }> {
    const query = this.announcementRepository.createQueryBuilder('announcement');

    if (type) {
      query.where('announcement.type = :type', { type });
    }

    query.andWhere('announcement.isActive = :isActive', { isActive: true });
    query.orderBy('announcement.createdAt', 'DESC');

    const total = await query.getCount();
    const data = await query.skip((page - 1) * limit).take(limit).getMany();

    return { data, total, page, limit };
  }

  async findByType(
    type: AnnouncementType,
    limit: number = 10,
  ): Promise<Announcement[]> {
    return await this.announcementRepository.find({
      where: { type, isActive: true },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async findById(id: number): Promise<Announcement> {
    const announcement = await this.announcementRepository.findOne({
      where: { id },
    });

    if (!announcement) {
      throw new NotFoundException(
        `Pengumuman dengan ID ${id} tidak ditemukan`,
      );
    }

    return announcement;
  }

  async findActive(): Promise<Announcement[]> {
    return await this.announcementRepository.find({
      where: { isActive: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findNotExpired(): Promise<Announcement[]> {
    const now = new Date();
    const query = this.announcementRepository.createQueryBuilder('announcement');

    query.where('announcement.isActive = :isActive', { isActive: true });
    query.andWhere(
      '(announcement.expiredAt IS NULL OR announcement.expiredAt > :now)',
      { now },
    );
    query.orderBy('announcement.createdAt', 'DESC');

    return await query.getMany();
  }

  async update(
    id: number,
    updateAnnouncementDto: UpdateAnnouncementDto,
  ): Promise<Announcement> {
    const announcement = await this.findById(id);
    Object.assign(announcement, updateAnnouncementDto);
    return await this.announcementRepository.save(announcement);
  }

  async delete(id: number): Promise<void> {
    const announcement = await this.findById(id);
    await this.announcementRepository.remove(announcement);
  }

  async toggleActive(id: number): Promise<Announcement> {
    const announcement = await this.findById(id);
    announcement.isActive = !announcement.isActive;
    return await this.announcementRepository.save(announcement);
  }

  async cleanExpiredAnnouncements(): Promise<number> {
    const result = await this.announcementRepository.delete({
      expiredAt: LessThan(new Date()),
      isActive: true,
    });
    return result.affected ?? 0;
  }
}
