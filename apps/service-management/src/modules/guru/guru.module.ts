import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GuruController } from './guru.controller';
import { GuruService } from './guru.service';
import { GuruEntity } from '../../entities/guru.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GuruEntity])],
  controllers: [GuruController],
  providers: [GuruService],
})
export class GuruModule {}