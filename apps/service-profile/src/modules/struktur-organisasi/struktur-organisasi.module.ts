import { Module } from '@nestjs/common';
import { StrukturOrganisasiController } from './struktur-organisasi.controller';
import { StrukturOrganisasiService } from './struktur-organisasi.service';

@Module({
  controllers: [StrukturOrganisasiController],
  providers: [StrukturOrganisasiService],
})
export class StrukturOrganisasiModule {}