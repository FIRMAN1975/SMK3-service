import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { VisiMisiService } from './visi-misi.service';
import { CreateVisiMisiDto, UpdateVisiMisiDto } from './visi-misi.dto';

@Controller('visi-misi')
export class VisiMisiController {
  constructor(private readonly service: VisiMisiService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateVisiMisiDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateVisiMisiDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}