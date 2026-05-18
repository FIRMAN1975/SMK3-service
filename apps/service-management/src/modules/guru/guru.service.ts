import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Guru } from './guru.entity';
import { CreateGuruDto, UpdateGuruDto } from './guru.dto';
import * as ExcelJS from 'exceljs';

@Injectable()
export class GuruService {
  constructor(
    @InjectRepository(Guru)
    private repo: Repository<Guru>,
  ) {}

  async getAll(limit = 10, offset = 0) {
    limit = Math.min(limit, 100);

    const [data, total] = await this.repo.findAndCount({
      order: { createdAt: 'DESC' },
      take: limit,
      skip: offset,
    });

    return {
      guru: data,
      limit,
      offset,
      hasMore: data.length === limit,
      total,
    };
  }

  async getById(id: string): Promise<Guru> {
    const guru = await this.repo.findOne({ where: { id } });
    if (!guru) throw new NotFoundException('Guru tidak ditemukan');
    return guru;
  }

  async create(dto: CreateGuruDto): Promise<Guru> {
    if (!dto.namaLengkap?.trim()) {
      throw new BadRequestException('namaLengkap wajib diisi');
    }

    const guru = this.repo.create({
      namaLengkap: dto.namaLengkap.trim(),
      nip: dto.nip ?? '',
      noTelepon: dto.noTelepon ?? '',
      anakWali: dto.anakWali ?? '',
      mataPelajaran: dto.mataPelajaran ?? '',
      alamat: dto.alamat ?? '',
      jabatan: dto.jabatan ?? '',
    });

    return this.repo.save(guru);
  }

  async update(id: string, dto: UpdateGuruDto): Promise<Guru> {
    const guru = await this.getById(id);

    if (dto.namaLengkap !== undefined) guru.namaLengkap = dto.namaLengkap.trim();
    if (dto.nip !== undefined) guru.nip = dto.nip;
    if (dto.noTelepon !== undefined) guru.noTelepon = dto.noTelepon;
    if (dto.anakWali !== undefined) guru.anakWali = dto.anakWali;
    if (dto.mataPelajaran !== undefined) guru.mataPelajaran = dto.mataPelajaran;
    if (dto.alamat !== undefined) guru.alamat = dto.alamat;
    if (dto.jabatan !== undefined) guru.jabatan = dto.jabatan;

    return this.repo.save(guru);
  }

  async delete(id: string): Promise<void> {
    const guru = await this.getById(id);
    await this.repo.remove(guru);
  }

  async search(
    keyword?: string,
    sortBy?: string,
    order: 'asc' | 'desc' = 'desc',
    limit = 10,
    offset = 0,
  ) {
    limit = Math.min(limit, 100);
    const dir = order?.toLowerCase() === 'asc' ? 'ASC' : 'DESC';

    const qb = this.repo.createQueryBuilder('g');

    if (keyword) {
      qb.where(
        'g.namaLengkap ILIKE :kw OR g.mataPelajaran ILIKE :kw',
        { kw: `%${keyword}%` },
      );
    }

    const sortMap: Record<string, string> = {
      nama: 'g.namaLengkap',
      nip: 'g.nip',
      mapel: 'g.mataPelajaran',
    };
    const orderCol = sortBy ? sortMap[sortBy] : 'g.createdAt';
    qb.orderBy(orderCol, dir).skip(offset).take(limit);

    const data = await qb.getMany();
    return { guru: data, limit, offset, hasMore: data.length === limit };
  }

  async getTotalGuru(): Promise<{ total: number }> {
    const total = await this.repo.count();
    return { total };
  }

  async exportExcel(): Promise<Buffer> {
    const data = await this.repo.find({ order: { namaLengkap: 'ASC' } });

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Data Guru');

    sheet.columns = [
      { header: 'NIP', key: 'nip', width: 20 },
      { header: 'Nama Lengkap', key: 'namaLengkap', width: 30 },
      { header: 'Mata Pelajaran', key: 'mataPelajaran', width: 25 },
      { header: 'Jabatan', key: 'jabatan', width: 25 },
      { header: 'No. Telepon', key: 'noTelepon', width: 18 },
      { header: 'Anak Wali', key: 'anakWali', width: 30 },
      { header: 'Alamat', key: 'alamat', width: 40 },
    ];

    data.forEach((g) => {
      sheet.addRow({
        nip: g.nip,
        namaLengkap: g.namaLengkap,
        mataPelajaran: g.mataPelajaran,
        jabatan: g.jabatan,
        noTelepon: g.noTelepon,
        anakWali: g.anakWali,
        alamat: g.alamat,
      });
    });

    return workbook.xlsx.writeBuffer() as unknown as Promise<Buffer>;
  }

  async importExcel(fileBuffer: Buffer): Promise<{ imported: number; skipped: number }> {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(fileBuffer as any);
    const sheet = workbook.getWorksheet(1);

    if (!sheet) {
      throw new Error('Worksheet tidak ditemukan');
    }

    let imported = 0;
    let skipped = 0;

    sheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      if (rowNumber === 1) return;

      const nip = String(row.getCell(1).value ?? '').trim();
      const namaLengkap = String(row.getCell(2).value ?? '').trim();
      const mataPelajaran = String(row.getCell(3).value ?? '').trim();
      const jabatan = String(row.getCell(4).value ?? '').trim();
      const noTelepon = String(row.getCell(5).value ?? '').trim();
      const anakWali = String(row.getCell(6).value ?? '').trim();
      const alamat = String(row.getCell(7).value ?? '').trim();

      if (!namaLengkap) { skipped++; return; }

      this.repo
        .save(
          this.repo.create({ nip, namaLengkap, mataPelajaran, jabatan, noTelepon, anakWali, alamat }),
        )
        .then(() => imported++)
        .catch(() => skipped++);
    });

    await new Promise((r) => setTimeout(r, 500));

    return { imported, skipped };
  }
}
