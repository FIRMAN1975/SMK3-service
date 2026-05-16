import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'guru' })
export class GuruEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'nama_lengkap', length: 255 })
  namaLengkap!: string;

  @Column({ length: 50 })
  nip!: string;

  @Column({ name: 'no_telepon', length: 20 })
  noTelepon!: string;

  @Column({ name: 'anak_wali', length: 255 })
  anakWali!: string;

  @Column({ name: 'mata_pelajaran', length: 100 })
  mataPelajaran!: string;

  @Column({ type: 'text' })
  alamat!: string;

  @Column({ length: 255 })
  jabatan!: string;
}