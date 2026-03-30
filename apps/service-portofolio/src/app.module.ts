import { Module } from '@nestjs/common';
import { PortofolioModule } from './modules/portofolio/portofolio.module'; // Pastikan path ini benar

@Module({
  imports: [
    PortofolioModule, // Hanya gunakan module portofolio kamu
  ],
})
export class AppModule {}