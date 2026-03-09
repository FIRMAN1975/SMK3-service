import { Controller, Get } from '@nestjs/common';
import { ServiceBeritaService } from './service-berita.service';

@Controller()
export class ServiceBeritaController {
  constructor(private readonly serviceBeritaService: ServiceBeritaService) {}

  @Get()
  getHello(): string {
    return this.serviceBeritaService.getHello();
  }
}
