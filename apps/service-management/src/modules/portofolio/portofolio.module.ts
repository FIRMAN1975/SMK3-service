import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PortofolioEntity } from '../../entities/portofolio.entity';
import { PortofolioService } from './portofolio.service';
import { PortofolioController } from './portofolio.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PortofolioEntity])],
  providers: [PortofolioService],
  controllers: [PortofolioController],
})
export class PortofolioModule {}
