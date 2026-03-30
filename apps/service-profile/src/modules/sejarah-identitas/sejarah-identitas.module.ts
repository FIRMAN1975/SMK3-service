import { Module } from '@nestjs/common';
import { SejarahIdentitasController } from './sejarah-identitas.controller';
import { SejarahIdentitasService } from './sejarah-identitas.service';

@Module({
  controllers: [SejarahIdentitasController],
  providers: [SejarahIdentitasService],
})
export class SejarahIdentitasModule {}