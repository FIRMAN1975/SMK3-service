import { Module } from '@nestjs/common';
import { MitraKerjasamaController } from './mitra-kerjasama.controller';
import { MitraKerjasamaService } from './mitra-kerjasama.service';

@Module({
  controllers: [MitraKerjasamaController],
  providers: [MitraKerjasamaService],
})
export class MitraKerjasamaModule {}