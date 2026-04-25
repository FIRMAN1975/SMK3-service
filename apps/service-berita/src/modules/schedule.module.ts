import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Schedule } from '../entities/schedule.entity';
import { ScheduleService } from '../services/schedule.service';
import { AgendaController } from '../controllers/agenda.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Schedule])],
  controllers: [AgendaController],
  providers: [ScheduleService],
  exports: [ScheduleService],
})
export class ScheduleModule {}
