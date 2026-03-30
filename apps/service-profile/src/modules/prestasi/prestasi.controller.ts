import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { PrestasiService } from './prestasi.service';
import { CreatePrestasiDto, UpdatePrestasiDto } from './prestasi.dto';

@Controller('prestasi')
export class PrestasiController {
  constructor(private readonly service: PrestasiService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() dto: CreatePrestasiDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePrestasiDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}