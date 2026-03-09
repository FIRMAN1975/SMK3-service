import { Module } from '@nestjs/common';
import { ServiceManagementController } from './service-management.controller';
import { ServiceManagementService } from './service-management.service';

@Module({
  imports: [],
  controllers: [ServiceManagementController],
  providers: [ServiceManagementService],
})
export class ServiceManagementModule {}
