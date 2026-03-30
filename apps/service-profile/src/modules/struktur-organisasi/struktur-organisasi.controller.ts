import {
  Controller, Get, Post, Put, Delete,
  Param, UploadedFile, UseInterceptors, BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { StrukturOrganisasiService } from './struktur-organisasi.service';
import { normalizePath } from '@app/common/utils/toolsUtil';

const multerOptions = {
  storage: diskStorage({
    destination: './uploads/struktur-organisasi',
    filename: (req: any, file: any, cb: any) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, `struktur-${uniqueSuffix}${extname(file.originalname)}`);
    },
  }),
  fileFilter: (req: any, file: any, cb: any) => {
    if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
      return cb(new BadRequestException('Hanya file gambar yang diperbolehkan'), false);
    }
    cb(null, true);
  },
};

@Controller('struktur-organisasi')
export class StrukturOrganisasiController {
  constructor(private readonly service: StrukturOrganisasiService) { }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  @UseInterceptors(FileInterceptor('gambar', multerOptions))
  create(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('File gambar wajib diupload');
    return this.service.create(normalizePath(file.path)); // ✅ fix backslash
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('gambar', multerOptions))
  update(@Param('id') id: string, @UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('File gambar wajib diupload');
    return this.service.update(id, normalizePath(file.path)); // ✅ fix backslash
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
