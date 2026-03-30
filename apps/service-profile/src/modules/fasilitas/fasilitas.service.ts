import { Injectable, NotFoundException } from '@nestjs/common';
import FasilitasModel from '../../models/FasilitasModel';
import { CreateFasilitasDto, UpdateFasilitasDto } from './fasilitas.dto';

@Injectable()
export class FasilitasService {
  async findAll() {
    return await FasilitasModel.findAll();
  }

  async findOne(id: string) {
    const data = await FasilitasModel.findByPk(id);
    if (!data) throw new NotFoundException('Data fasilitas tidak ditemukan');
    return data;
  }

  async create(dto: CreateFasilitasDto, fotoPath?: string) {
    return await FasilitasModel.create({ ...dto, foto: fotoPath } as any);
  }

  async update(id: string, dto: UpdateFasilitasDto, fotoPath?: string) {
    const data = await this.findOne(id);
    return await data.update({ ...dto, ...(fotoPath && { foto: fotoPath }) });
  }

  async remove(id: string) {
    const data = await this.findOne(id);
    await data.destroy();
    return { message: 'Data berhasil dihapus' };
  }
}