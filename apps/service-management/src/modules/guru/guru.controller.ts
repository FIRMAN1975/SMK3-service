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
  UseInterceptors,
  UploadedFile,
  ParseUUIDPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { GuruService } from './guru.service';
import { CreateGuruDto, UpdateGuruDto } from './guru.dto';

function successResponse(message: string, data: any) {
  return { status: 'success', message, data };
}

@Controller('management/guru')
export class GuruController {
  constructor(private guruService: GuruService) {}

  @Get()
  async getAll(
    @Query('limit') limit = 10,
    @Query('offset') offset = 0,
  ) {
    const data = await this.guruService.getAll(Number(limit), Number(offset));
    return successResponse('Berhasil mengambil data guru', data);
  }

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

  @Get('total')
  async getTotal() {
    const data = await this.guruService.getTotalGuru();
    return successResponse('Berhasil mengambil total guru', data);
  }

  @Get('export')
  async exportExcel(@Res() res: Response) {
    const buffer = await this.guruService.exportExcel();
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="data-guru.xlsx"');
    res.send(buffer);
  }

  @Get(':id')
  async getById(@Param('id', ParseUUIDPipe) id: string) {
    const data = await this.guruService.getById(id);
    return successResponse('Berhasil mengambil data', { guru: data });
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() body: CreateGuruDto) {
    const data = await this.guruService.create(body);
    return successResponse('Berhasil menambah guru', { guru: data });
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateGuruDto,
  ) {
    const data = await this.guruService.update(id, body);
    return successResponse('Berhasil mengubah data', { guru: data });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    await this.guruService.delete(id);
  }

  @Post('import')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('file'))
  async importExcel(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new Error('File tidak ditemukan dalam request');
    const result = await this.guruService.importExcel(file.buffer);
    return successResponse('Import selesai', result);
  }
}
