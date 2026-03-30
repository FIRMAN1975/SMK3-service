import { Injectable, NotFoundException } from '@nestjs/common';
import ProgramKeahlianModel from '../../models/ProgramKeahlianModel';
import { CreateProgramKeahlianDto, UpdateProgramKeahlianDto } from './program-keahlian.dto';

@Injectable()
export class ProgramKeahlianService {
  async findAll() {
    return await ProgramKeahlianModel.findAll();
  }

  async findOne(id: string) {
    const data = await ProgramKeahlianModel.findByPk(id);
    if (!data) throw new NotFoundException('Data program keahlian tidak ditemukan');
    return data;
  }

  async create(dto: CreateProgramKeahlianDto) {
    return await ProgramKeahlianModel.create({ ...dto } as any);
  }

  async update(id: string, dto: UpdateProgramKeahlianDto) {
    const data = await this.findOne(id);
    return await data.update({ ...dto });
  }

  async remove(id: string) {
    const data = await this.findOne(id);
    await data.destroy();
    return { message: 'Data berhasil dihapus' };
  }
}