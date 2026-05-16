import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SiswaEntity } from '../../entities/siswa.entity';
import { SiswaController } from './siswa.controller';
import { SiswaService } from './siswa.service';

@Module({
  imports: [TypeOrmModule.forFeature([SiswaEntity])],
  controllers: [SiswaController],
  providers: [SiswaService],
})
export class SiswaModule {}