import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PortofolioEntity, PortofolioStatus } from '../../entities/portofolio.entity';
import { ApiResponse } from '../../common/api-response';
import { PortofolioRequestDto } from '../../dto/portofolio-request.dto';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

@Injectable()
export class PortofolioService {
  constructor(
    @InjectRepository(PortofolioEntity)
    private readonly repo: Repository<PortofolioEntity>,
  ) {}

  private parsePagination(value: string | undefined, fallback: number): number {
    const parsed = Number.parseInt(value ?? '', 10);
    return Number.isNaN(parsed) || parsed < 0 ? fallback : parsed;
  }

  async getAll(limitValue?: string, offsetValue?: string): Promise<ApiResponse<{ portofolio: PortofolioEntity[] }>> {
    const limit = this.parsePagination(limitValue, 10);
    const offset = this.parsePagination(offsetValue, 0);

    const rows = await this.repo
      .createQueryBuilder('p')
      .orderBy('p.id', 'DESC')
      .skip(offset)
      .take(limit + 1)
      .getMany();

    const hasMore = rows.length > limit;

    return {
      status: 'success',
      message: 'Berhasil mengambil data portofolio',
      data: { portofolio: rows.slice(0, limit) },
    };
  }

  async getMine(ownerUserId: string) {
    const rows = await this.repo.find({ where: { ownerUserId }, order: { id: 'DESC' } });
    return { status: 'success', message: 'Berhasil mengambil data', data: { portofolio: rows } };
  }

  async getById(id: string) {
    const numeric = Number.parseInt(id, 10);
    if (Number.isNaN(numeric)) throw new BadRequestException('ID tidak valid');

    const row = await this.repo.findOne({ where: { id: numeric } });
    if (!row) throw new NotFoundException('Portofolio tidak ditemukan');

    return { status: 'success', message: 'Berhasil mengambil data', data: { portofolio: row } };
  }

  async create(dto: PortofolioRequestDto, ownerUserId: string, ownerUsername: string) {
    const entity = this.repo.create({
      title: dto.title,
      description: dto.description ?? null,
      ownerUserId: ownerUserId ?? '',
      ownerUsername: ownerUsername ?? '',
      status: PortofolioStatus.DRAFT,
    });

    const saved = await this.repo.save(entity);

    return { status: 'success', message: 'Berhasil membuat portofolio', data: { portofolio: saved } };
  }

  async uploadFile(id: string, file: Express.Multer.File) {
    const numeric = Number.parseInt(id, 10);
    if (Number.isNaN(numeric)) throw new BadRequestException('ID tidak valid');

    const row = await this.repo.findOne({ where: { id: numeric } });
    if (!row) throw new NotFoundException('Portofolio tidak ditemukan');

    if (!file) throw new BadRequestException('File wajib diunggah');

    const originalName = file.originalname.toLowerCase();
    const isPdf = file.mimetype === 'application/pdf' || originalName.endsWith('.pdf');
    if (!isPdf) throw new BadRequestException('Hanya file PDF yang diperbolehkan');

    const uploadsDir = join(process.cwd(), 'uploads', 'service-management', 'portofolio');
    if (!existsSync(uploadsDir)) mkdirSync(uploadsDir, { recursive: true });

    const fileName = `portofolio_${numeric}_${Date.now()}.pdf`;
    const filePath = join(uploadsDir, fileName);
    writeFileSync(filePath, file.buffer);

    row.filePath = ['uploads', 'service-management', 'portofolio', fileName].join('/');
    row.fileName = fileName;

    const saved = await this.repo.save(row);

    return { status: 'success', message: 'Berhasil upload file', data: { portofolio: saved } };
  }

  async getDownloadFile(id: string) {
    const numeric = Number.parseInt(id, 10);
    if (Number.isNaN(numeric)) throw new BadRequestException('ID tidak valid');

    const row = await this.repo.findOne({ where: { id: numeric } });
    if (!row) throw new NotFoundException('Portofolio tidak ditemukan');

    if (!row.filePath) throw new NotFoundException('File tidak tersedia');

    const absolutePath = join(process.cwd(), row.filePath);
    if (!existsSync(absolutePath)) throw new NotFoundException('File tidak ditemukan');

    return { filePath: absolutePath, fileName: row.fileName ?? 'file.pdf', ownerUserId: row.ownerUserId };
  }

  async publish(id: string, reviewer: string) {
    const numeric = Number.parseInt(id, 10);
    if (Number.isNaN(numeric)) throw new BadRequestException('ID tidak valid');

    const row = await this.repo.findOne({ where: { id: numeric } });
    if (!row) throw new NotFoundException('Portofolio tidak ditemukan');

    row.status = PortofolioStatus.PUBLISHED;
    row.reviewedBy = reviewer;
    row.reviewedAt = new Date();

    await this.repo.save(row);
    return { status: 'success', message: 'Berhasil publish', data: { portofolio: row } };
  }

  async reject(id: string, reviewer: string, reason?: string) {
    const numeric = Number.parseInt(id, 10);
    if (Number.isNaN(numeric)) throw new BadRequestException('ID tidak valid');

    const row = await this.repo.findOne({ where: { id: numeric } });
    if (!row) throw new NotFoundException('Portofolio tidak ditemukan');

    row.status = PortofolioStatus.REJECTED;
    row.reviewedBy = reviewer;
    row.reviewedAt = new Date();
    row.rejectionReason = reason ?? null;

    await this.repo.save(row);
    return { status: 'success', message: 'Berhasil reject', data: { portofolio: row } };
  }
}
