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
  Req,
  UseInterceptors,
  UploadedFile,
  ParseUUIDPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import type { Request } from 'express';
import { SiswaService } from './siswa.service';
import { CreateSiswaDto, UpdateSiswaDto } from './siswa.dto';

function successResponse(message: string, data: any) {
  return { status: 'success', message, data };
}

function parseHeaderList(value: string | string[] | undefined): string[] {
  if (!value) return [];
  const raw = Array.isArray(value) ? value.join(',') : value;
  return raw
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

@Controller('management/siswa')
export class SiswaController {
  constructor(private siswaService: SiswaService) {}

  @Get()
  async getAll(
    @Query('limit') limit = 10,
    @Query('offset') offset = 0,
  ) {
    const data = await this.siswaService.getAll(Number(limit), Number(offset));
    return successResponse('Berhasil mengambil data siswa', data);
  }

  @Get('search')
  async search(
    @Query('keyword') keyword?: string,
    @Query('sortBy') sortBy?: string,
    @Query('order') order: 'asc' | 'desc' = 'desc',
    @Query('limit') limit = 10,
    @Query('offset') offset = 0,
  ) {
    const data = await this.siswaService.search(keyword, sortBy, order, Number(limit), Number(offset));
    return successResponse('Berhasil mencari data', data);
  }

  @Get('stats')
  async getStats() {
    const data = await this.siswaService.getStats();
    return successResponse('Berhasil ambil statistik', data);
  }

  @Get('export')
  async exportExcel(@Res() res: Response) {
    const buffer = await this.siswaService.exportExcel();
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="data-siswa.xlsx"');
    res.send(buffer);
  }

  @Get(':id')
  async getById(@Param('id', ParseUUIDPipe) id: string) {
    const data = await this.siswaService.getById(id);
    return successResponse('Berhasil mengambil data', { siswa: data });
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() body: CreateSiswaDto) {
    const data = await this.siswaService.create(body);
    return successResponse('Berhasil menambah siswa', { siswa: data });
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateSiswaDto,
  ) {
    const data = await this.siswaService.update(id, body);
    return successResponse('Berhasil mengubah data', { siswa: data });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    await this.siswaService.delete(id);
  }

  @Post('import')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('file'))
  async importExcel(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new Error('File tidak ditemukan dalam request');
    const result = await this.siswaService.importExcel(file.buffer);
    return successResponse('Import selesai', result);
  }

  @Post(':id/upload/:type')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('type') type: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const result = await this.siswaService.uploadFile(id, type, file);
    return successResponse('File berhasil diupload', result);
  }

  @Get(':id/download/:type')
  async downloadFile(
    @Req() req: Request,
    @Param('id', ParseUUIDPipe) id: string,
    @Param('type') type: string,
    @Res() res: Response,
  ) {
    const userId = req.header('x-user-id') ?? undefined;
    const roles = parseHeaderList(req.header('x-user-roles'));
    const filePath = await this.siswaService.getFilePath(id, type, { userId, roles });
    res.download(filePath);
  }
}
