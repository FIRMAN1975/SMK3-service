import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { Repository } from 'typeorm';
import { ApiResponse, SiswaListResponse, SiswaResponse } from '../../common/api-response';
import { SiswaRequestDto } from '../../dto/siswa-request.dto';
import { SiswaEntity } from '../../entities/siswa.entity';
import { RabbitmqService } from '../rabbitmq/rabbitmq.service';

@Injectable()
export class SiswaService {
  constructor(
    @InjectRepository(SiswaEntity)
    private readonly siswaRepository: Repository<SiswaEntity>,
    private readonly rabbitmqService: RabbitmqService,
  ) {}

  private toResponse(entity: SiswaEntity): SiswaResponse {
    return {
      id: entity.id.toString(),
      namaLengkap: entity.namaLengkap,
      jurusan: entity.jurusan,
      nisn: entity.nisn,
      nis: entity.nis,
      kelas: entity.kelas,
      tanggalLahir: entity.tanggalLahir,
      alamat: entity.alamat,
      noWaOrtu: entity.noWaOrtu,
      status: entity.status,
      raporFile: entity.raporFile,
      sklFile: entity.sklFile,
      ijazahFile: entity.ijazahFile,
    };
  }

  private parsePagination(value: string | undefined, fallback: number): number {
    const parsed = Number.parseInt(value ?? '', 10);
    return Number.isNaN(parsed) || parsed < 0 ? fallback : parsed;
  }

  private requireCreateFields(dto: SiswaRequestDto) {
    const errors: string[] = [];
    if (!dto.namaLengkap?.trim()) errors.push('namaLengkap: namaLengkap is required');
    if (!dto.nisn?.trim()) errors.push('nisn: nisn is required');
    if (!dto.kelas?.trim()) errors.push('kelas: kelas is required');

    if (errors.length > 0) {
      throw new BadRequestException(errors.join('|'));
    }
  }

  private resolveSiswaSortColumn(sortBy?: string): string {
    if (sortBy === 'nama') return 'siswa.nama_lengkap';
    if (sortBy === 'nisn') return 'siswa.nisn';
    if (sortBy === 'kelas') return 'siswa.kelas';
    return 'siswa.id';
  }

  private buildCsv(rows: SiswaEntity[]): string {
    const header = ['NISN', 'Nama', 'Kelas', 'Jurusan', 'Status'];
    const lines = rows.map((row) => [
      row.nisn,
      row.namaLengkap,
      row.kelas,
      row.jurusan,
      row.status,
    ]);

    return [header, ...lines]
      .map((row) => row.map((value) => `"${String(value ?? '').replaceAll('"', '""')}"`).join(','))
      .join('\n');
  }

  async getAll(limitValue?: string, offsetValue?: string): Promise<ApiResponse<SiswaListResponse>> {
    const limit = this.parsePagination(limitValue, 10);
    const offset = this.parsePagination(offsetValue, 0);

    const siswaRows = await this.siswaRepository
      .createQueryBuilder('siswa')
      .orderBy('siswa.id', 'DESC')
      .skip(offset)
      .take(limit + 1)
      .getMany();

    const hasMore = siswaRows.length > limit;

    return {
      status: 'success',
      message: 'Berhasil mengambil data siswa',
      data: {
        siswa: siswaRows.slice(0, limit).map((siswa) => this.toResponse(siswa)),
        limit,
        offset,
        hasMore,
      },
    };
  }

  async search(
    keyword?: string,
    sortBy?: string,
    order?: string,
    limitValue?: string,
    offsetValue?: string,
  ): Promise<ApiResponse<{ siswa: SiswaResponse[] }>> {
    const limit = this.parsePagination(limitValue, 10);
    const offset = this.parsePagination(offsetValue, 0);
    const sortDirection = order?.toLowerCase() === 'asc' ? 'ASC' : 'DESC';

    const query = this.siswaRepository.createQueryBuilder('siswa');

    if (keyword?.trim()) {
      query.where(
        '(siswa.nama_lengkap ILIKE :keyword OR siswa.nisn ILIKE :keyword)',
        { keyword: `%${keyword.trim()}%` },
      );
    }

    const siswaRows = await query
      .orderBy(this.resolveSiswaSortColumn(sortBy), sortDirection)
      .skip(offset)
      .take(limit)
      .getMany();

    return {
      status: 'success',
      message: 'Berhasil mencari data',
      data: {
        siswa: siswaRows.map((siswa) => this.toResponse(siswa)),
      },
    };
  }

  async getById(id: string): Promise<ApiResponse<{ siswa: SiswaResponse }>> {
    const numericId = Number.parseInt(id, 10);
    if (Number.isNaN(numericId)) {
      throw new BadRequestException('ID tidak valid');
    }

    const siswa = await this.siswaRepository.findOne({ where: { id: numericId } });
    if (!siswa) {
      throw new NotFoundException('Siswa tidak ditemukan');
    }

    return {
      status: 'success',
      message: 'Berhasil mengambil data',
      data: { siswa: this.toResponse(siswa) },
    };
  }

  async create(dto: SiswaRequestDto): Promise<ApiResponse<{ siswa: SiswaResponse }>> {
    this.requireCreateFields(dto);

    const entity = this.siswaRepository.create({
      namaLengkap: dto.namaLengkap?.trim() ?? '',
      jurusan: dto.jurusan?.trim() ?? '',
      nisn: dto.nisn?.trim() ?? '',
      nis: dto.nis?.trim() ?? '',
      kelas: dto.kelas?.trim() ?? '',
      tanggalLahir: dto.tanggalLahir?.trim() ?? '',
      alamat: dto.alamat?.trim() ?? '',
      noWaOrtu: dto.noWaOrtu?.trim() ?? '',
      status: dto.status?.trim() ?? '',
      raporFile: dto.raporFile ?? null,
      sklFile: dto.sklFile ?? null,
      ijazahFile: dto.ijazahFile ?? null,
    });

    const saved = await this.siswaRepository.save(entity);

    await this.rabbitmqService.publishEvent('siswa.created', {
      siswaId: saved.id.toString(),
      namaLengkap: saved.namaLengkap,
      nisn: saved.nisn,
      kelas: saved.kelas,
    });

    return {
      status: 'success',
      message: 'Berhasil menambah siswa',
      data: { siswa: this.toResponse(saved) },
    };
  }

  async update(id: string, dto: SiswaRequestDto): Promise<ApiResponse<{ message: string }>> {
    const numericId = Number.parseInt(id, 10);
    if (Number.isNaN(numericId)) {
      throw new BadRequestException('ID tidak valid');
    }

    const siswa = await this.siswaRepository.findOne({ where: { id: numericId } });
    if (!siswa) {
      throw new NotFoundException('Siswa tidak ditemukan');
    }

    siswa.namaLengkap = dto.namaLengkap?.trim() ?? siswa.namaLengkap;
    siswa.jurusan = dto.jurusan?.trim() ?? siswa.jurusan;
    siswa.nisn = dto.nisn?.trim() ?? siswa.nisn;
    siswa.nis = dto.nis?.trim() ?? siswa.nis;
    siswa.kelas = dto.kelas?.trim() ?? siswa.kelas;
    siswa.tanggalLahir = dto.tanggalLahir?.trim() ?? siswa.tanggalLahir;
    siswa.alamat = dto.alamat?.trim() ?? siswa.alamat;
    siswa.noWaOrtu = dto.noWaOrtu?.trim() ?? siswa.noWaOrtu;
    siswa.status = dto.status?.trim() ?? siswa.status;
    siswa.raporFile = dto.raporFile ?? siswa.raporFile;
    siswa.sklFile = dto.sklFile ?? siswa.sklFile;
    siswa.ijazahFile = dto.ijazahFile ?? siswa.ijazahFile;

    const saved = await this.siswaRepository.save(siswa);

    await this.rabbitmqService.publishEvent('siswa.updated', {
      siswaId: saved.id.toString(),
      namaLengkap: saved.namaLengkap,
      nisn: saved.nisn,
      kelas: saved.kelas,
    });

    return {
      status: 'success',
      message: 'Berhasil mengubah data',
      data: { message: 'Siswa berhasil diupdate' },
    };
  }

  async delete(id: string): Promise<ApiResponse<{ message: string }>> {
    const numericId = Number.parseInt(id, 10);
    if (Number.isNaN(numericId)) {
      throw new BadRequestException('ID tidak valid');
    }

    const siswa = await this.siswaRepository.findOne({ where: { id: numericId } });
    if (!siswa) {
      throw new NotFoundException('Siswa tidak ditemukan');
    }

    const filesToDelete = [siswa.raporFile, siswa.sklFile, siswa.ijazahFile]
      .filter((filePath): filePath is string => Boolean(filePath));

    await this.siswaRepository.remove(siswa);

    for (const filePath of filesToDelete) {
      const absolutePath = join(process.cwd(), filePath);
      if (existsSync(absolutePath)) {
        try {
          // eslint-disable-next-line @typescript-eslint/no-require-imports
          const { unlinkSync } = await import('fs');
          unlinkSync(absolutePath);
        } catch {
          // Ignore file cleanup failures.
        }
      }
    }

    return {
      status: 'success',
      message: 'Berhasil menghapus data',
      data: { message: 'Siswa berhasil dihapus' },
    };
  }

  async getStats(): Promise<ApiResponse<{ total: number; aktif: number; lulus: number }>> {
    const total = await this.siswaRepository.count();
    const aktif = await this.siswaRepository.count({ where: { status: 'aktif' } });
    const lulus = await this.siswaRepository.count({ where: { status: 'lulus' } });

    return {
      status: 'success',
      message: 'Berhasil ambil statistik',
      data: { total, aktif, lulus },
    };
  }

  async exportCsv(): Promise<string> {
    const data = await this.siswaRepository
      .createQueryBuilder('siswa')
      .orderBy('siswa.id', 'DESC')
      .getMany();

    return this.buildCsv(data);
  }

  async getDownloadFile(id: string, type: string): Promise<{ filePath: string; fileName: string }> {
    const numericId = Number.parseInt(id, 10);
    if (Number.isNaN(numericId)) {
      throw new BadRequestException('ID tidak valid');
    }

    const siswa = await this.siswaRepository.findOne({ where: { id: numericId } });
    if (!siswa) {
      throw new NotFoundException('Siswa tidak ditemukan');
    }

    const storedPath = this.resolveStoredFilePath(siswa, type);
    if (!storedPath) {
      throw new NotFoundException('File tidak tersedia');
    }

    const absolutePath = join(process.cwd(), storedPath);
    if (!existsSync(absolutePath)) {
      throw new NotFoundException('File tidak ditemukan');
    }

    return {
      filePath: absolutePath,
      fileName: storedPath.split(/[\\/]/).pop() ?? 'file.pdf',
    };
  }

  async uploadFile(
    id: string,
    type: string,
    file?: Express.Multer.File,
  ): Promise<ApiResponse<{ siswa: SiswaResponse }>> {
    const numericId = Number.parseInt(id, 10);
    if (Number.isNaN(numericId)) {
      throw new BadRequestException('ID tidak valid');
    }

    if (!['rapor', 'skl', 'ijazah'].includes(type)) {
      throw new BadRequestException('Tipe file tidak valid. Gunakan: rapor, skl, ijazah');
    }

    if (!file) {
      throw new BadRequestException('File PDF wajib diunggah');
    }

    const originalName = file.originalname.toLowerCase();
    const isPdf = file.mimetype === 'application/pdf' || originalName.endsWith('.pdf');
    if (!isPdf) {
      throw new BadRequestException('Hanya file PDF yang diperbolehkan');
    }

    const siswa = await this.siswaRepository.findOne({ where: { id: numericId } });
    if (!siswa) {
      throw new NotFoundException('Siswa tidak ditemukan');
    }

    const uploadsDir = join(process.cwd(), 'uploads', 'service-management', 'siswa');
    mkdirSync(uploadsDir, { recursive: true });

    const fileName = `${type}_${numericId}_${Date.now()}.pdf`;
    const filePath = join(uploadsDir, fileName);
    writeFileSync(filePath, file.buffer);

    const relativePath = ['uploads', 'service-management', 'siswa', fileName].join('/');
    if (type === 'rapor') {
      siswa.raporFile = relativePath;
    } else if (type === 'skl') {
      siswa.sklFile = relativePath;
    } else {
      siswa.ijazahFile = relativePath;
    }

    const saved = await this.siswaRepository.save(siswa);

    return {
      status: 'success',
      message: 'Berhasil upload file',
      data: { siswa: this.toResponse(saved) },
    };
  }

  private resolveStoredFilePath(siswa: SiswaEntity, type: string): string | null {
    if (type === 'rapor') return siswa.raporFile;
    if (type === 'skl') return siswa.sklFile;
    if (type === 'ijazah') return siswa.ijazahFile;
    return null;
  }
}