import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GuruRequestDto } from '../../dto/guru-request.dto';
import {
  ApiResponse,
  GuruListResponse,
  GuruResponse,
} from '../../common/api-response';
import { GuruEntity } from '../../entities/guru.entity';
import { RabbitmqService } from '../rabbitmq/rabbitmq.service';

@Injectable()
export class GuruService {
  constructor(
    @InjectRepository(GuruEntity)
    private readonly guruRepository: Repository<GuruEntity>,
    private readonly rabbitmqService: RabbitmqService,
  ) {}

  private toResponse(entity: GuruEntity): GuruResponse {
    return {
      id: entity.id.toString(),
      namaLengkap: entity.namaLengkap,
      nip: entity.nip,
      noTelepon: entity.noTelepon,
      anakWali: entity.anakWali,
      mataPelajaran: entity.mataPelajaran,
      alamat: entity.alamat,
      jabatan: entity.jabatan,
    };
  }

  private parsePagination(value: string | undefined, fallback: number): number {
    const parsed = Number.parseInt(value ?? '', 10);
    return Number.isNaN(parsed) || parsed < 0 ? fallback : parsed;
  }

  private requireCreateFields(dto: GuruRequestDto) {
    const errors: string[] = [];
    if (!dto.namaLengkap?.trim()) errors.push('namaLengkap: namaLengkap is required');
    if (!dto.nip?.trim()) errors.push('nip: nip is required');
    if (!dto.mataPelajaran?.trim()) errors.push('mataPelajaran: mataPelajaran is required');

    if (errors.length > 0) {
      throw new BadRequestException(errors.join('|'));
    }
  }

  async getAll(limitValue?: string, offsetValue?: string): Promise<ApiResponse<GuruListResponse>> {
    const limit = this.parsePagination(limitValue, 10);
    const offset = this.parsePagination(offsetValue, 0);

    const guruRows = await this.guruRepository
      .createQueryBuilder('guru')
      .orderBy('guru.id', 'DESC')
      .skip(offset)
      .take(limit + 1)
      .getMany();

    const hasMore = guruRows.length > limit;

    return {
      status: 'success',
      message: 'Berhasil mengambil data guru',
      data: {
        guru: guruRows.slice(0, limit).map((guru) => this.toResponse(guru)),
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
  ): Promise<ApiResponse<{ guru: GuruResponse[] }>> {
    const limit = this.parsePagination(limitValue, 10);
    const offset = this.parsePagination(offsetValue, 0);
    const sortDirection = order?.toLowerCase() === 'asc' ? 'ASC' : 'DESC';

    const sortColumn =
      sortBy === 'nama'
        ? 'guru.nama_lengkap'
        : sortBy === 'nip'
          ? 'guru.nip'
          : sortBy === 'mapel'
            ? 'guru.mata_pelajaran'
            : 'guru.id';

    const query = this.guruRepository.createQueryBuilder('guru');

    if (keyword?.trim()) {
      query.where(
        '(guru.nama_lengkap ILIKE :keyword OR guru.mata_pelajaran ILIKE :keyword OR guru.nip ILIKE :keyword)',
        { keyword: `%${keyword.trim()}%` },
      );
    }

    const guruRows = await query
      .orderBy(sortColumn, sortDirection)
      .skip(offset)
      .take(limit)
      .getMany();

    return {
      status: 'success',
      message: 'Berhasil mencari data',
      data: {
        guru: guruRows.map((guru) => this.toResponse(guru)),
      },
    };
  }

  async getTotalGuru(): Promise<ApiResponse<{ total: number }>> {
    const total = await this.guruRepository.count();

    return {
      status: 'success',
      message: 'Berhasil mengambil total guru',
      data: { total },
    };
  }

  async getById(id: string): Promise<ApiResponse<{ guru: GuruResponse }>> {
    const numericId = Number.parseInt(id, 10);
    if (Number.isNaN(numericId)) {
      throw new BadRequestException('ID tidak valid');
    }

    const guru = await this.guruRepository.findOne({ where: { id: numericId } });
    if (!guru) {
      throw new NotFoundException('Guru tidak ditemukan');
    }

    return {
      status: 'success',
      message: 'Berhasil mengambil data',
      data: { guru: this.toResponse(guru) },
    };
  }

  async create(dto: GuruRequestDto): Promise<ApiResponse<{ guru: GuruResponse }>> {
    this.requireCreateFields(dto);

    const entity = this.guruRepository.create({
      namaLengkap: dto.namaLengkap?.trim() ?? '',
      nip: dto.nip?.trim() ?? '',
      noTelepon: dto.noTelepon?.trim() ?? '',
      anakWali: dto.anakWali?.trim() ?? '',
      mataPelajaran: dto.mataPelajaran?.trim() ?? '',
      alamat: dto.alamat?.trim() ?? '',
      jabatan: dto.jabatan?.trim() ?? '',
    });

    const saved = await this.guruRepository.save(entity);

    await this.rabbitmqService.publishEvent('guru.created', {
      guruId: saved.id.toString(),
      namaLengkap: saved.namaLengkap,
      nip: saved.nip,
      mataPelajaran: saved.mataPelajaran,
    });

    return {
      status: 'success',
      message: 'Berhasil menambah guru',
      data: { guru: this.toResponse(saved) },
    };
  }

  async update(id: string, dto: GuruRequestDto): Promise<ApiResponse<{ message: string }>> {
    const numericId = Number.parseInt(id, 10);
    if (Number.isNaN(numericId)) {
      throw new BadRequestException('ID tidak valid');
    }

    const guru = await this.guruRepository.findOne({ where: { id: numericId } });
    if (!guru) {
      throw new NotFoundException('Guru tidak ditemukan');
    }

    guru.namaLengkap = dto.namaLengkap?.trim() ?? guru.namaLengkap;
    guru.nip = dto.nip?.trim() ?? guru.nip;
    guru.noTelepon = dto.noTelepon?.trim() ?? guru.noTelepon;
    guru.anakWali = dto.anakWali?.trim() ?? guru.anakWali;
    guru.mataPelajaran = dto.mataPelajaran?.trim() ?? guru.mataPelajaran;
    guru.alamat = dto.alamat?.trim() ?? guru.alamat;
    guru.jabatan = dto.jabatan?.trim() ?? guru.jabatan;

    const saved = await this.guruRepository.save(guru);

    await this.rabbitmqService.publishEvent('guru.updated', {
      guruId: saved.id.toString(),
      namaLengkap: saved.namaLengkap,
      nip: saved.nip,
      mataPelajaran: saved.mataPelajaran,
    });

    return {
      status: 'success',
      message: 'Berhasil mengubah data',
      data: { message: 'Guru berhasil diupdate' },
    };
  }

  async delete(id: string): Promise<ApiResponse<{ message: string }>> {
    const numericId = Number.parseInt(id, 10);
    if (Number.isNaN(numericId)) {
      throw new BadRequestException('ID tidak valid');
    }

    const guru = await this.guruRepository.findOne({ where: { id: numericId } });
    if (!guru) {
      throw new NotFoundException('Guru tidak ditemukan');
    }

    await this.guruRepository.remove(guru);

    return {
      status: 'success',
      message: 'Berhasil menghapus data',
      data: { message: 'Guru berhasil dihapus' },
    };
  }
}