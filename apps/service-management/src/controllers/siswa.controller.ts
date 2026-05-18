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
  Req,
  Res,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseUUIDPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Request, Response } from 'express';
import * as path from 'path';
import { SiswaService } from '../services/siswa.service';
import { CreateSiswaDto, UpdateSiswaDto } from '../dtos/siswa.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { JwtPayload } from '../guards/jwt-auth.guard';
import { successResponse } from '../common/response';

@Controller('management/siswa')
@UseGuards(JwtAuthGuard)
export class SiswaController {
  constructor(private siswaService: SiswaService) {}

  // ── Admin-only routes ──────────────────────────────────────────

  // GET /api/management/siswa?limit=10&offset=0
  @Get()
  @UseGuards(RolesGuard)
  @Roles('admin')
  async getAll(
    @Query('limit') limit = 10,
    @Query('offset') offset = 0,
  ) {
    const data = await this.siswaService.getAll(Number(limit), Number(offset));
    return successResponse('Berhasil mengambil data siswa', data);
  }

  // GET /api/management/siswa/search?keyword=...&sortBy=nama&order=desc
  @Get('search')
  @UseGuards(RolesGuard)
  @Roles('admin')
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

  // GET /api/management/siswa/stats
  @Get('stats')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async getStats() {
    const data = await this.siswaService.getStats();
    return successResponse('Berhasil ambil statistik', data);
  }

  // GET /api/management/siswa/export
  @Get('export')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async exportExcel(@Res() res: Response) {
    const buffer = await this.siswaService.exportExcel();
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="data-siswa.xlsx"');
    res.send(buffer);
  }

  // GET /api/management/siswa/:id
  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async getById(@Param('id', ParseUUIDPipe) id: string) {
    const data = await this.siswaService.getById(id);
    return successResponse('Berhasil mengambil data', { siswa: data });
  }

  // POST /api/management/siswa
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(RolesGuard)
  @Roles('admin')
  async create(@Body() body: CreateSiswaDto) {
    const data = await this.siswaService.create(body);
    return successResponse('Berhasil menambah siswa', { siswa: data });
  }

  // PUT /api/management/siswa/:id
  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateSiswaDto,
  ) {
    const data = await this.siswaService.update(id, body);
    return successResponse('Berhasil mengubah data', { siswa: data });
  }

  // DELETE /api/management/siswa/:id
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(RolesGuard)
  @Roles('admin')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    await this.siswaService.delete(id);
  }

  // POST /api/management/siswa/import  (multipart/form-data, field: file)
  @Post('import')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RolesGuard)
  @Roles('admin')
  @UseInterceptors(FileInterceptor('file'))
  async importExcel(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new Error('File tidak ditemukan dalam request');
    const result = await this.siswaService.importExcel(file.buffer);
    return successResponse('Import selesai', result);
  }

  // POST /api/management/siswa/:id/upload/:type  (multipart/form-data, field: file)
  @Post(':id/upload/:type')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('type') type: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const result = await this.siswaService.uploadFile(id, type, file);
    return successResponse('File berhasil diupload', result);
  }

  // ── Download — dapat diakses admin DAN siswa ──────────────────
  // GET /api/management/siswa/:id/download/:type
  //
  // Admin  : bisa download rapor / skl / ijazah siswa siapapun
  // Siswa  : hanya boleh download SKL miliknya sendiri
  //          (dicek via ownerUserId di DB == userId di token)
  @Get(':id/download/:type')
  async downloadFile(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('type') type: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const user: JwtPayload = req['user'];
    const filePath = await this.siswaService.resolveDownload(id, type, user);

    res.setHeader('Content-Disposition', `attachment; filename="${path.basename(filePath)}"`);
    res.sendFile(path.resolve(filePath));
  }
}
