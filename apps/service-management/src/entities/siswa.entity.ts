import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'siswa' })
export class SiswaEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'nama_lengkap', type: 'varchar', length: 255 })
  namaLengkap!: string;

  @Column({ type: 'varchar', length: 100 })
  jurusan!: string;

  @Column({ type: 'varchar', length: 50 })
  nisn!: string;

  @Column({ type: 'varchar', length: 50 })
  nis!: string;

  @Column({ type: 'varchar', length: 20 })
  kelas!: string;

  @Column({ name: 'tanggal_lahir', type: 'varchar', length: 20 })
  tanggalLahir!: string;

  @Column({ type: 'text' })
  alamat!: string;

  @Column({ name: 'no_wa_ortu', type: 'varchar', length: 20 })
  noWaOrtu!: string;

  @Column({ type: 'varchar', length: 20 })
  status!: string;

  // ── PERBAIKAN: Tambah type: 'varchar' & ubah any menjadi string ──
  @Column({ name: 'rapor_file', type: 'varchar', length: 255, nullable: true })
  raporFile!: string | null;

  @Column({ name: 'skl_file', type: 'varchar', length: 255, nullable: true })
  sklFile!: string | null;

  @Column({ name: 'ijazah_file', type: 'varchar', length: 255, nullable: true })
  ijazahFile!: string | null;
}