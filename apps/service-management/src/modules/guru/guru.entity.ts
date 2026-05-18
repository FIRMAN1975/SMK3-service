import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('guru')
export class Guru {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'varchar', length: 255 })
  namaLengkap: string;

  @Column({ type: 'varchar', length: 50, default: '' })
  nip: string;

  @Column({ type: 'varchar', length: 20, default: '' })
  noTelepon: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  anakWali: string;

  @Column({ type: 'varchar', length: 100, default: '' })
  mataPelajaran: string;

  @Column({ type: 'text', default: '' })
  alamat: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  jabatan: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
