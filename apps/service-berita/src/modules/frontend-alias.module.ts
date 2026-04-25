import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';

// ✅ FIX PATH
import { NewsModule } from './news.module';
import { AnnouncementModule } from './announcement.module';
import { ScheduleModule } from './schedule.module';

// Controllers
import { BeritaController } from '../controllers/berita.controller';
import { AgendaController } from '../controllers/agenda.controller';
import { PengumumanController } from '../controllers/pengumuman.controller';

// ✅ FIX NAMA FILE
import {
  SejarahController,
  VisiMisiController,
  StrukturController,
  ProgramKeahlianController,
  FasilitasController,
  PrestasiController,
  MitraKerjasamaController,
} from '../controllers/profil.controller';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadDir = './uploads';
          if (!existsSync(uploadDir)) mkdirSync(uploadDir, { recursive: true });
          cb(null, uploadDir);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
    NewsModule,
    AnnouncementModule,
    ScheduleModule,
  ],
  controllers: [
    BeritaController,
    AgendaController,
    PengumumanController,
    SejarahController,
    VisiMisiController,
    StrukturController,
    ProgramKeahlianController,
    FasilitasController,
    PrestasiController,
    MitraKerjasamaController,
  ],
})
export class FrontendAliasModule {}