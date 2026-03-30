import { Injectable, NotFoundException } from '@nestjs/common';
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
    return await MitraKerjaSamaModel.create({ ...dto, logo: logoPath } as any);
  }

  async update(id: string, dto: UpdateMitraKerjasamaDto, logoPath?: string) {
    const data = await this.findOne(id);
    return await data.update({ ...dto, ...(logoPath && { logo: logoPath }) });
  }

  async remove(id: string) {
    const data = await this.findOne(id);
    await data.destroy();
    return { message: 'Data berhasil dihapus' };
  }
}