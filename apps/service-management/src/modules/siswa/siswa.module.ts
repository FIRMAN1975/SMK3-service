import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Siswa } from './siswa.entity';
import { SiswaService } from './siswa.service';
import { SiswaController } from './siswa.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Siswa])],
  providers: [SiswaService],
  controllers: [SiswaController],
  exports: [SiswaService],
})
export class SiswaModule {}
