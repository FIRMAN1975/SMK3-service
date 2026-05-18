import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Guru } from './guru.entity';
import { GuruService } from './guru.service';
import { GuruController } from './guru.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Guru])],
  providers: [GuruService],
  controllers: [GuruController],
  exports: [GuruService],
})
export class GuruModule {}
