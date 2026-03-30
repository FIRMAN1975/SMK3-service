import { Injectable, NotFoundException } from '@nestjs/common';
import StrukturOrganisasiModel from '../../models/StrukturOrganisasiModel';

@Injectable()
export class StrukturOrganisasiService {
  async findAll() {
    return await StrukturOrganisasiModel.findAll();
  }

  async findOne(id: string) {
    const data = await StrukturOrganisasiModel.findByPk(id);
    if (!data)
      throw new NotFoundException('Data struktur organisasi tidak ditemukan');
    return data;
  }

  async create(gambar: string) {
    return await StrukturOrganisasiModel.create({ gambar } as any);
  }

  async update(id: string, gambar: string) {
    const data = await this.findOne(id);
    return await data.update({ gambar });
  }

  async remove(id: string) {
    const data = await this.findOne(id);
    await data.destroy();
    return { message: 'Data berhasil dihapus' };
  }
}