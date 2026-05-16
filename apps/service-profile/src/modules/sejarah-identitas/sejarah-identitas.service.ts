import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import SejarahIdentitasModel from '../../models/SejarahIdentitasModel';
import {
  CreateSejarahIdentitasDto,
  UpdateSejarahIdentitasDto,
} from './sejarah-identitas.dto';

@Injectable()
export class SejarahIdentitasService {
  async findAll() {
    return await SejarahIdentitasModel.findAll();
  }

  async findOne(id: string) {
    const data = await SejarahIdentitasModel.findByPk(id);
    if (!data) throw new NotFoundException('Data sejarah identitas tidak ditemukan');
    return data;
  }

  async create(dto: CreateSejarahIdentitasDto) {
    const count = await SejarahIdentitasModel.count();
    if (count > 0) {
      throw new BadRequestException('Sejarah identitas hanya boleh memiliki satu data utama');
    }

    return await SejarahIdentitasModel.create({ ...dto } as any);
  }

  async update(id: string, dto: UpdateSejarahIdentitasDto) {
    const data = await this.findOne(id);
    return await data.update({ ...dto });
  }

  async remove(id: string) {
    const data = await this.findOne(id);
    await data.destroy();
    return { message: 'Data berhasil dihapus' };
  }
}
