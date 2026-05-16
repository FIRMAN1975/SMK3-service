import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { GuruRequestDto } from '../../dto/guru-request.dto';
import { GuruService } from './guru.service';

@Controller('guru')
export class GuruController {
  constructor(private readonly guruService: GuruService) {}

  @Get()
  getAll(
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return this.guruService.getAll(limit, offset);
  }

  @Get('search')
  search(
    @Query('keyword') keyword?: string,
    @Query('sortBy') sortBy?: string,
    @Query('order') order?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return this.guruService.search(keyword, sortBy, order, limit, offset);
  }

  @Get('total')
  getTotalGuru() {
    return this.guruService.getTotalGuru();
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.guruService.getById(id);
  }

  @Post()
  create(@Body() dto: GuruRequestDto) {
    return this.guruService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: GuruRequestDto) {
    return this.guruService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.guruService.delete(id);
  }
}