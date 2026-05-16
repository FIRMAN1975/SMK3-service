import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { SiswaRequestDto } from '../../dto/siswa-request.dto';
import { SiswaService } from './siswa.service';

@Controller('siswa')
export class SiswaController {
  constructor(private readonly siswaService: SiswaService) {}

  @Get()
  getAll(
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return this.siswaService.getAll(limit, offset);
  }

  @Get('search')
  search(
    @Query('keyword') keyword?: string,
    @Query('sortBy') sortBy?: string,
    @Query('order') order?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return this.siswaService.search(keyword, sortBy, order, limit, offset);
  }

  @Get('stats')
  getStats() {
    return this.siswaService.getStats();
  }

  @Get('export')
  async exportExcel(@Res() res: Response) {
    const exportResult = await this.siswaService.exportCsv();
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="data-siswa.csv"');
    return res.status(200).send(exportResult);
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.siswaService.getById(id);
  }

  @Post()
  create(@Body() dto: SiswaRequestDto) {
    return this.siswaService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: SiswaRequestDto) {
    return this.siswaService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.siswaService.delete(id);
  }

  @Get(':id/download/:type')
  async download(
    @Param('id') id: string,
    @Param('type') type: string,
    @Res() res: Response,
  ) {
    const file = await this.siswaService.getDownloadFile(id, type);
    return res.download(file.filePath, file.fileName);
  }

  @Post(':id/upload/:type')
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @Param('id') id: string,
    @Param('type') type: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.siswaService.uploadFile(id, type, file);
  }
}