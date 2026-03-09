import { Module } from '@nestjs/common';
import { ServicePelanggaranController } from './service-pelanggaran.controller';
import { ServicePelanggaranService } from './service-pelanggaran.service';

@Module({
  imports: [],
  controllers: [ServicePelanggaranController],
  providers: [ServicePelanggaranService],
})
export class ServicePelanggaranModule {}
