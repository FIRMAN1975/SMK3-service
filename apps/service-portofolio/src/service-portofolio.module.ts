import { Module } from '@nestjs/common';
import { ServicePortofolioController } from './service-portofolio.controller';
import { ServicePortofolioService } from './service-portofolio.service';

@Module({
  imports: [],
  controllers: [ServicePortofolioController],
  providers: [ServicePortofolioService],
})
export class ServicePortofolioModule {}
