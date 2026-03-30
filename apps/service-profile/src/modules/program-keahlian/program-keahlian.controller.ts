import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ProgramKeahlianService } from './program-keahlian.service';
import { CreateProgramKeahlianDto, UpdateProgramKeahlianDto } from './program-keahlian.dto';

@Controller('program-keahlian')
export class ProgramKeahlianController {
  constructor(private readonly service: ProgramKeahlianService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateProgramKeahlianDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProgramKeahlianDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}