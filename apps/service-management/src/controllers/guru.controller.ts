import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  Res,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseUUIDPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type {Response} from 'express';
import { GuruService } from '../services/guru.service';
import { CreateGuruDto, UpdateGuruDto } from '../dtos/guru.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { successResponse } from '../common/response';

@Controller('management/guru')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class GuruController {
  constructor(private guruService: GuruService) {}

  // GET /api/management/guru?limit=10&offset=0
  @Get()
  async getAll(
    @Query('limit') limit = 10,
    @Query('offset') offset = 0,
  ) {
    const data = await this.guruService.getAll(Number(limit), Number(offset));
    return successResponse('Berhasil mengambil data guru', data);
  }

  // GET /api/management/guru/search?keyword=...&sortBy=nama&order=asc&limit=10&offset=0
  @Get('search')
  async search(
    @Query('keyword') keyword?: string,
    @Query('sortBy') sortBy?: string,
    @Query('order') order: 'asc' | 'desc' = 'desc',
    @Query('limit') limit = 10,
    @Query('offset') offset = 0,
  ) {
    const data = await this.guruService.search(keyword, sortBy, order, Number(limit), Number(offset));
    return successResponse('Berhasil mencari data', data);
  }

  // GET /api/management/guru/total
  @Get('total')
  async getTotal() {
    const data = await this.guruService.getTotalGuru();
    return successResponse('Berhasil mengambil total guru', data);
  }

  // GET /api/management/guru/export
  @Get('export')
  async exportExcel(@Res() res: Response) {
    const buffer = await this.guruService.exportExcel();
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="data-guru.xlsx"');
    res.send(buffer);
  }

  // GET /api/management/guru/:id
  @Get(':id')
  async getById(@Param('id', ParseUUIDPipe) id: string) {
    const data = await this.guruService.getById(id);
    return successResponse('Berhasil mengambil data', { guru: data });
  }

  // POST /api/management/guru
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() body: CreateGuruDto) {
    const data = await this.guruService.create(body);
    return successResponse('Berhasil menambah guru', { guru: data });
  }

  // PUT /api/management/guru/:id
  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateGuruDto,
  ) {
    const data = await this.guruService.update(id, body);
    return successResponse('Berhasil mengubah data', { guru: data });
  }

  // DELETE /api/management/guru/:id
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    await this.guruService.delete(id);
  }

  // POST /api/management/guru/import  (multipart/form-data, field: file)
  @Post('import')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('file'))
  async importExcel(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new Error('File tidak ditemukan dalam request');
    const result = await this.guruService.importExcel(file.buffer);
    return successResponse('Import selesai', result);
  }
}
