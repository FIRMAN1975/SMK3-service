import { Module } from '@nestjs/common';
import { FasilitasController } from './fasilitas.controller';
import { FasilitasService } from './fasilitas.service';

@Module({
  controllers: [FasilitasController],
  providers: [FasilitasService],
})
export class FasilitasModule {}