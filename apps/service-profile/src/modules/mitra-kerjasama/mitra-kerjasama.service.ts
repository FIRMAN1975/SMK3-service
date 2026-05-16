import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import MitraKerjaSamaModel from '../../models/MitraKerjaSamaModel';
import { CreateMitraKerjasamaDto, UpdateMitraKerjasamaDto } from './mitra-kerjasama.dto';

@Injectable()
export class MitraKerjasamaService {
  async findAll() {
    return await MitraKerjaSamaModel.findAll();
  }

  async findOne(id: string) {
    const data = await MitraKerjaSamaModel.findByPk(id);
    if (!data) throw new NotFoundException('Data mitra kerjasama tidak ditemukan');
    return data;
  }

  async create(dto: CreateMitraKerjasamaDto, logoPath?: string) {
    const existing = await MitraKerjaSamaModel.findOne({
      where: { nama_mitra: dto.nama_mitra },
    });
    if (existing) throw new BadRequestException('Mitra kerja sama sudah terdaftar');

    return await MitraKerjaSamaModel.create({ ...dto, logo: logoPath } as any);
  }

  async update(id: string, dto: UpdateMitraKerjasamaDto, logoPath?: string) {
    const data = await this.findOne(id);
    if (dto.nama_mitra) {
      const existing = await MitraKerjaSamaModel.findOne({
        where: { nama_mitra: dto.nama_mitra },
      });
      if (existing && existing.getDataValue('id') !== id) {
        throw new BadRequestException('Mitra kerja sama sudah terdaftar');
      }
    }

    return await data.update({ ...dto, ...(logoPath && { logo: logoPath }) });
  }

  async remove(id: string) {
    const data = await this.findOne(id);
    await data.destroy();
    return { message: 'Data berhasil dihapus' };
  }
}
