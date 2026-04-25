import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PortofolioController } from '../portofolio/portofolio.controller';
import { PortofolioService } from '../portofolio/portofolio.service';
import  Portofolio  from '../../models/PortofolioModel';

@Module({
  imports: [
    // Ini penting agar PortofolioService bisa menggunakan model Sequelize
    SequelizeModule.forFeature([Portofolio]),
  ],
  controllers: [PortofolioController],
  providers: [PortofolioService],
})
export class PortofolioModule {}