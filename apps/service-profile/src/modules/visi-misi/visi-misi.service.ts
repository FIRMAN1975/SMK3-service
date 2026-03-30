import { Injectable, NotFoundException } from '@nestjs/common';
import VisiMisiModel from '../../models/VisiMisiModel';
import { CreateVisiMisiDto, UpdateVisiMisiDto } from './visi-misi.dto';

@Injectable()
export class VisiMisiService {
  async findAll() {
    return await VisiMisiModel.findAll();
  }

  async findOne(id: string) {
    const data = await VisiMisiModel.findByPk(id);
    if (!data) throw new NotFoundException('Data visi misi tidak ditemukan');
    return data;
  }

  async create(dto: CreateVisiMisiDto) {
    return await VisiMisiModel.create({ ...dto } as any);
  }

  async update(id: string, dto: UpdateVisiMisiDto) {
    const data = await this.findOne(id);
    return await data.update({ ...dto });
  }

  async remove(id: string) {
    const data = await this.findOne(id);
    await data.destroy();
    return { message: 'Data berhasil dihapus' };
  }
}