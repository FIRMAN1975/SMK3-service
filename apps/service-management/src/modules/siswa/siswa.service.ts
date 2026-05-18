import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Siswa } from './siswa.entity';
import { CreateSiswaDto, UpdateSiswaDto } from './siswa.dto';
import * as ExcelJS from 'exceljs';
import * as path from 'path';
import * as fs from 'fs';
import { Role } from '@app/common';

const ALLOWED_TYPES = ['rapor', 'skl', 'ijazah'] as const;
type FileType = (typeof ALLOWED_TYPES)[number];

type AccessContext = {
  userId?: string;
  roles?: string[];
};

@Injectable()
export class SiswaService {
  constructor(
    @InjectRepository(Siswa)
    private repo: Repository<Siswa>,
  ) {}

  async getAll(limit = 10, offset = 0) {
    limit = Math.min(limit, 100);

    const [data, total] = await this.repo.findAndCount({
      order: { createdAt: 'DESC' },
      take: limit,
      skip: offset,
    });

    return {
      siswa: data,
      limit,
      offset,
      hasMore: data.length === limit,
      total,
    };
  }

  async getById(id: string): Promise<Siswa> {
    const siswa = await this.repo.findOne({ where: { id } });
    if (!siswa) throw new NotFoundException('Siswa tidak ditemukan');
    return siswa;
  }

  async create(dto: CreateSiswaDto): Promise<Siswa> {
    if (!dto.namaLengkap?.trim()) throw new BadRequestException('namaLengkap wajib diisi');
    if (!dto.nisn?.trim()) throw new BadRequestException('nisn wajib diisi');
    if (!dto.kelas?.trim()) throw new BadRequestException('kelas wajib diisi');

    const siswa = this.repo.create({
      ownerUserId: dto.ownerUserId ?? undefined,
      namaLengkap: dto.namaLengkap.trim(),
      jurusan: dto.jurusan ?? '',
      nisn: dto.nisn.trim(),
      nis: dto.nis ?? '',
      kelas: dto.kelas.trim(),
      tanggalLahir: dto.tanggalLahir ?? '',
      alamat: dto.alamat ?? '',
      noWaOrtu: dto.noWaOrtu ?? '',
      status: dto.status ?? 'aktif',
    });

    return this.repo.save(siswa);
  }

  async update(id: string, dto: UpdateSiswaDto): Promise<Siswa> {
    const siswa = await this.getById(id);

    if (dto.ownerUserId !== undefined) siswa.ownerUserId = dto.ownerUserId;
    if (dto.namaLengkap !== undefined) siswa.namaLengkap = dto.namaLengkap.trim();
    if (dto.jurusan !== undefined) siswa.jurusan = dto.jurusan;
    if (dto.nisn !== undefined) siswa.nisn = dto.nisn;
    if (dto.nis !== undefined) siswa.nis = dto.nis;
    if (dto.kelas !== undefined) siswa.kelas = dto.kelas;
    if (dto.tanggalLahir !== undefined) siswa.tanggalLahir = dto.tanggalLahir;
    if (dto.alamat !== undefined) siswa.alamat = dto.alamat;
    if (dto.noWaOrtu !== undefined) siswa.noWaOrtu = dto.noWaOrtu;
    if (dto.status !== undefined) siswa.status = dto.status;
    if (dto.raporFile !== undefined) siswa.raporFile = dto.raporFile;
    if (dto.sklFile !== undefined) siswa.sklFile = dto.sklFile;
    if (dto.ijazahFile !== undefined) siswa.ijazahFile = dto.ijazahFile;

    return this.repo.save(siswa);
  }

  async delete(id: string): Promise<void> {
    const siswa = await this.getById(id);
    await this.repo.remove(siswa);
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

    const qb = this.repo.createQueryBuilder('s');

    if (keyword) {
      qb.where(
        's.namaLengkap ILIKE :kw OR s.nisn ILIKE :kw',
        { kw: `%${keyword}%` },
      );
    }

    const sortMap: Record<string, string> = {
      nama: 's.namaLengkap',
      nisn: 's.nisn',
      kelas: 's.kelas',
    };
    const orderCol = sortBy ? sortMap[sortBy] : 's.createdAt';
    qb.orderBy(orderCol, dir).skip(offset).take(limit);

    const data = await qb.getMany();
    return { siswa: data, limit, offset, hasMore: data.length === limit };
  }

  async getStats() {
    const total = await this.repo.count();
    const aktif = await this.repo.count({ where: { status: 'aktif' } });
    const lulus = await this.repo.count({ where: { status: 'lulus' } });
    const nonaktif = await this.repo.count({ where: { status: 'nonaktif' } });
    return { total, aktif, lulus, nonaktif };
  }

  async uploadFile(
    id: string,
    type: string,
    file: Express.Multer.File,
  ): Promise<{ path: string }> {
    if (!ALLOWED_TYPES.includes(type as FileType)) {
      throw new BadRequestException('Tipe file tidak valid. Gunakan: rapor, skl, ijazah');
    }

    if (!file) throw new BadRequestException('File tidak ditemukan dalam request');

    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== '.pdf') throw new BadRequestException('Hanya file PDF yang diperbolehkan');

    const uploadDir = process.env.UPLOAD_DIR ?? 'uploads';
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const fileName = `${type}_${id}_${Date.now()}${ext}`;
    const filePath = path.join(uploadDir, fileName);
    fs.writeFileSync(filePath, file.buffer);

    const siswa = await this.getById(id);
    const relativePath = `${uploadDir}/${fileName}`;

    if (type === 'rapor') siswa.raporFile = relativePath;
    if (type === 'skl') siswa.sklFile = relativePath;
    if (type === 'ijazah') siswa.ijazahFile = relativePath;

    await this.repo.save(siswa);
    return { path: relativePath };
  }

  async getFilePath(id: string, type: string, access?: AccessContext): Promise<string> {
    const siswa = await this.getById(id);

    let filePath: string | null = null;
    if (type === 'rapor') filePath = siswa.raporFile;
    if (type === 'skl') filePath = siswa.sklFile;
    if (type === 'ijazah') filePath = siswa.ijazahFile;

    if (!filePath) {
      throw new NotFoundException(`File ${type} belum tersedia untuk siswa ini`);
    }

    const roles = access?.roles ?? [];
    const isAdmin = roles.includes(Role.ADMIN);
    const isOwner = !!access?.userId && siswa.ownerUserId === access.userId;

    if (!isAdmin && !isOwner) {
      throw new ForbiddenException('File hanya dapat diakses oleh siswa pemilik data atau admin');
    }

    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('File tidak ditemukan di server');
    }

    return filePath;
  }

  async exportExcel(): Promise<Buffer> {
    const data = await this.repo.find({ order: { namaLengkap: 'ASC' } });

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Data Siswa');

    sheet.columns = [
      { header: 'NISN', key: 'nisn', width: 20 },
      { header: 'NIS', key: 'nis', width: 15 },
      { header: 'Nama Lengkap', key: 'namaLengkap', width: 30 },
      { header: 'Kelas', key: 'kelas', width: 12 },
      { header: 'Jurusan', key: 'jurusan', width: 25 },
      { header: 'Tanggal Lahir', key: 'tanggalLahir', width: 15 },
      { header: 'Alamat', key: 'alamat', width: 40 },
      { header: 'No. WA Ortu', key: 'noWaOrtu', width: 18 },
      { header: 'Status', key: 'status', width: 12 },
    ];

    data.forEach((s) => {
      sheet.addRow({
        nisn: s.nisn,
        nis: s.nis,
        namaLengkap: s.namaLengkap,
        kelas: s.kelas,
        jurusan: s.jurusan,
        tanggalLahir: s.tanggalLahir,
        alamat: s.alamat,
        noWaOrtu: s.noWaOrtu,
        status: s.status,
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

    const saves: Promise<any>[] = [];
    let skipped = 0;

    sheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      if (rowNumber === 1) return;

      const nisn = String(row.getCell(1).value ?? '').trim();
      const nis = String(row.getCell(2).value ?? '').trim();
      const namaLengkap = String(row.getCell(3).value ?? '').trim();
      const kelas = String(row.getCell(4).value ?? '').trim();
      const jurusan = String(row.getCell(5).value ?? '').trim();
      const tanggalLahir = String(row.getCell(6).value ?? '').trim();
      const alamat = String(row.getCell(7).value ?? '').trim();
      const noWaOrtu = String(row.getCell(8).value ?? '').trim();
      const status = String(row.getCell(9).value ?? '').trim() || 'aktif';

      if (!namaLengkap || !nisn) { skipped++; return; }

      saves.push(
        this.repo
          .save(this.repo.create({ nisn, nis, namaLengkap, kelas, jurusan, tanggalLahir, alamat, noWaOrtu, status }))
          .catch(() => { skipped++; }),
      );
    });

    const results = await Promise.allSettled(saves);
    const imported = results.filter((r) => r.status === 'fulfilled').length;

    return { imported, skipped };
  }
}
