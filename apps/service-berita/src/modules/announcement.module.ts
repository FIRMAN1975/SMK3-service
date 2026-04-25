import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Announcement } from '../entities/announcement.entity';
import { AnnouncementService } from '../services/announcement.service';
import { PengumumanController } from '../controllers/pengumuman.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Announcement])],
  providers: [AnnouncementService],
  controllers: [PengumumanController],
  exports: [AnnouncementService],
})
export class AnnouncementModule {}
