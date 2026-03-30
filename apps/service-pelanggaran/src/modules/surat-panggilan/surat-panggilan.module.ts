import { Module } from '@nestjs/common';
import { SuratPanggilanController } from './surat-panggilan.controller';
import { SuratPanggilanService } from './surat-panggilan.service';

@Module({
    controllers: [SuratPanggilanController],
    providers: [SuratPanggilanService],
})
export class SuratPanggilanModule { }