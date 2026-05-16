import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
  ForbiddenException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Request, Response } from 'express';
import { PortofolioService } from './portofolio.service';
import { PortofolioRequestDto } from '../../dto/portofolio-request.dto';

@Controller('portofolio')
export class PortofolioController {
  constructor(private readonly svc: PortofolioService) {}

  @Get()
  getAll(@Query('limit') limit?: string, @Query('offset') offset?: string) {
    return this.svc.getAll(limit, offset);
  }

  @Get('me')
  getMine(@Req() req: Request) {
    const userId = String(req.headers['x-user-id'] ?? '');
    return this.svc.getMine(userId);
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.svc.getById(id);
  }

  @Post()
  create(@Req() req: Request, @Body() dto: PortofolioRequestDto) {
    const userId = String(req.headers['x-user-id'] ?? '');
    const username = String(req.headers['x-user-name'] ?? '');
    return this.svc.create(dto, userId, username);
  }

  @Post(':id/upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    const userId = String(req.headers['x-user-id'] ?? '');
    const roles = String(req.headers['x-user-roles'] ?? '');

    // check ownership or admin
    const downloadInfo = await this.svc.getDownloadFile(id).catch(() => null);
    if (downloadInfo) {
      if (downloadInfo.ownerUserId !== userId && !roles.split(',').includes('admin')) {
        throw new ForbiddenException('Hanya owner atau admin yang boleh mengunggah file');
      }
    }

    return this.svc.uploadFile(id, file);
  }

  @Get(':id/download')
  async download(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const userId = String(req.headers['x-user-id'] ?? '');
    const roles = String(req.headers['x-user-roles'] ?? '');

    const file = await this.svc.getDownloadFile(id);

    if (file.ownerUserId !== userId && !roles.split(',').includes('admin')) {
      throw new ForbiddenException('Akses ditolak');
    }

    return res.download(file.filePath, file.fileName);
  }

  @Put(':id/publish')
  async publish(@Param('id') id: string, @Req() req: Request) {
    const roles = String(req.headers['x-user-roles'] ?? '');
    if (!roles.split(',').includes('admin')) throw new ForbiddenException('Hanya admin');
    const reviewer = String(req.headers['x-user-name'] ?? '');
    return this.svc.publish(id, reviewer);
  }

  @Put(':id/reject')
  async reject(@Param('id') id: string, @Req() req: Request, @Body() body: { reason?: string }) {
    const roles = String(req.headers['x-user-roles'] ?? '');
    if (!roles.split(',').includes('admin')) throw new ForbiddenException('Hanya admin');
    const reviewer = String(req.headers['x-user-name'] ?? '');
    return this.svc.reject(id, reviewer, body.reason);
  }
}
