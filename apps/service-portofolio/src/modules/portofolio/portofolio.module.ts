import { Module } from '@nestjs/common';
import { PortofolioController } from './portofolio.controller';
import { PortofolioService } from './portofolio.service';

@Module({
    controllers: [PortofolioController],
    providers: [PortofolioService],
})
export class PortofolioModule { }