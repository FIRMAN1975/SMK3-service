import { Module } from '@nestjs/common';
import { ProgramKeahlianController } from './program-keahlian.controller';
import { ProgramKeahlianService } from './program-keahlian.service';

@Module({
  controllers: [ProgramKeahlianController],
  providers: [ProgramKeahlianService],
})
export class ProgramKeahlianModule {}