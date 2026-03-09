import { Controller, Get } from '@nestjs/common';
import { ServicePortofolioService } from './service-portofolio.service';

@Controller()
export class ServicePortofolioController {
  constructor(private readonly servicePortofolioService: ServicePortofolioService) {}

  @Get()
  getHello(): string {
    return this.servicePortofolioService.getHello();
  }
}
