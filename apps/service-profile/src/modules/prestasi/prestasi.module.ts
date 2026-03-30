import { Module } from '@nestjs/common';
import { PrestasiController } from './prestasi.controller';
import { PrestasiService } from './prestasi.service';

@Module({
  controllers: [PrestasiController],
  providers: [PrestasiService],
})
export class PrestasiModule {}