import { Injectable, NotFoundException } from '@nestjs/common';
import PrestasiModel from '../../models/PrestasiModel';
import { CreatePrestasiDto, UpdatePrestasiDto } from './prestasi.dto';

@Injectable()
export class PrestasiService {
  async findAll() {
    return await PrestasiModel.findAll();
  }

  async findOne(id: string) {
    const data = await PrestasiModel.findByPk(id);
    if (!data) throw new NotFoundException('Data prestasi tidak ditemukan');
    return data;
  }

  async create(dto: CreatePrestasiDto) {
    return await PrestasiModel.create({ ...dto } as any);
  }

  async update(id: string, dto: UpdatePrestasiDto) {
    const data = await this.findOne(id);
    return await data.update({ ...dto });
  }

  async remove(id: string) {
    const data = await this.findOne(id);
    await data.destroy();
    return { message: 'Data berhasil dihapus' };
  }
}