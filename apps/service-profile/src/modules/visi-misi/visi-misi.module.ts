import { Module } from '@nestjs/common';
import { VisiMisiController } from './visi-misi.controller';
import { VisiMisiService } from './visi-misi.service';

@Module({
  controllers: [VisiMisiController],
  providers: [VisiMisiService],
})
export class VisiMisiModule {}