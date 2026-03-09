import { Module } from '@nestjs/common';
import { ServiceProfileController } from './service-profile.controller';
import { ServiceProfileService } from './service-profile.service';

@Module({
  imports: [],
  controllers: [ServiceProfileController],
  providers: [ServiceProfileService],
})
export class ServiceProfileModule {}
