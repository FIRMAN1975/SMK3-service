import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
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

  @Index()
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
  participants: string;

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

  /** 🔥 AUDIT */
  @Column({ nullable: true })
  createdBy: string;

  @Column({ nullable: true })
  updatedBy: string;

  @CreateDateColumn()
  @Index()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}