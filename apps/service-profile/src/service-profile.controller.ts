import { Controller, Get } from '@nestjs/common';
import { ServiceProfileService } from './service-profile.service';

@Controller()
export class ServiceProfileController {
  constructor(private readonly serviceProfileService: ServiceProfileService) {}

  @Get()
  getHello(): string {
    return this.serviceProfileService.getHello();
  }
}
