import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { SejarahIdentitasService } from './sejarah-identitas.service';
import {
  CreateSejarahIdentitasDto,
  UpdateSejarahIdentitasDto,
} from './sejarah-identitas.dto';

@Controller('sejarah-identitas')
export class SejarahIdentitasController {
  constructor(private readonly service: SejarahIdentitasService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateSejarahIdentitasDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateSejarahIdentitasDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}