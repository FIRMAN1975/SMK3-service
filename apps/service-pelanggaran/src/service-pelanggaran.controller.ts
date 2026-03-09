import { Controller, Get } from '@nestjs/common';
import { ServicePelanggaranService } from './service-pelanggaran.service';

@Controller()
export class ServicePelanggaranController {
  constructor(private readonly servicePelanggaranService: ServicePelanggaranService) {}

  @Get()
  getHello(): string {
    return this.servicePelanggaranService.getHello();
  }
}
