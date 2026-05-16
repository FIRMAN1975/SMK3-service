import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { CreateCategoryDto, UpdateCategoryDto } from '../dtos';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private repo: Repository<Category>,
  ) {}

  async create(dto: CreateCategoryDto): Promise<Category> {
    const entity = this.repo.create({
      ...dto,
      name: dto.name.trim(),
    });

    return this.repo.save(entity);
  }

  async findAll(): Promise<Category[]> {
    return this.repo.find({
      where: { isActive: true },
      order: { order: 'ASC' },
    });
  }

  async findById(id: number): Promise<Category> {
    const data = await this.repo.findOne({ where: { id, isActive: true } });

    if (!data) {
      throw new NotFoundException(`Category ${id} tidak ditemukan atau telah dihapus`);
    }

    return data;
  }

  async update(id: number, dto: UpdateCategoryDto): Promise<Category> {
    const entity = await this.findById(id);

    if (dto.name !== undefined) entity.name = dto.name.trim();
    if (dto.description !== undefined) entity.description = dto.description;
    if (dto.color !== undefined) entity.color = dto.color;
    if (dto.order !== undefined) entity.order = dto.order;
    if (dto.isActive !== undefined) entity.isActive = dto.isActive;

    return this.repo.save(entity);
  }

  async delete(id: number): Promise<void> {
    const entity = await this.findById(id);
    const activeNewsCount = await this.repo
      .createQueryBuilder('c')
      .leftJoin('c.news', 'n', 'n.isActive = true')
      .where('c.id = :id', { id })
      .andWhere('n.id IS NOT NULL')
      .getCount();

    if (activeNewsCount > 0) {
      throw new BadRequestException(
        'Kategori masih digunakan oleh berita aktif',
      );
    }

    entity.isActive = false;
    await this.repo.save(entity);
  }

  async toggleActive(id: number): Promise<Category> {
    const entity = await this.findById(id);
    entity.isActive = !entity.isActive;
    return this.repo.save(entity);
  }
}
