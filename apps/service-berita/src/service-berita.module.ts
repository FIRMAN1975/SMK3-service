import { Module } from '@nestjs/common';
import { ServiceBeritaController } from './service-berita.controller';
import { ServiceBeritaService } from './service-berita.service';

@Module({
  imports: [],
  controllers: [ServiceBeritaController],
  providers: [ServiceBeritaService],
})
export class ServiceBeritaModule {}
