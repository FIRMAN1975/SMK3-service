import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum ScheduleCategory {
  AKADEMIK = 'akademik',
  EKSTRAKURIKULER = 'ekstrakurikuler',
  OUTING = 'outing',
  LIBUR = 'libur',
  UJIAN = 'ujian',
  KEGIATAN = 'kegiatan',
  LAINNYA = 'lainnya',
}

@Entity('schedules')
export class Schedule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'time', nullable: true })
  startTime: string;

  @Column({ type: 'time', nullable: true })
  endTime: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  location: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  participants: string; // Misal: "Kelas X, XI, XII"

  @Column({
    type: 'enum',
    enum: ScheduleCategory,
    default: ScheduleCategory.KEGIATAN,
  })
  category: ScheduleCategory;

  @Column({ type: 'varchar', length: 255, nullable: true })
  imageUrl: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
