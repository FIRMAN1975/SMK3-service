import { IsString, IsNotEmpty, IsOptional, IsIn } from 'class-validator';

// Daftar opsi jurusan agar validasi di BE sama ketatnya dengan FE
const JURUSAN_OPTIONS = [
  'Tataboga', 'Perhotelan', 'Teknik Komputer', 'Multimedia',
  'Akuntansi', 'Informatika', 'Administrasi Perkantoran', 'Pemasaran',
];

export class CreatePortfolioDto {
  @IsString()
  @IsNotEmpty({ message: 'Judul karya wajib diisi' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'Deskripsi wajib diisi' })
  description: string;

  @IsString()
  @IsOptional()
  studentName?: string;

  @IsString()
  @IsOptional()
  @IsIn(JURUSAN_OPTIONS, { message: 'Jurusan tidak valid' })
  major: string;

  @IsString()
  @IsOptional()
  category: string;

  @IsString()
  @IsOptional()
  skill: string;

  @IsString()
  @IsOptional()
  image: string; // Ini akan menerima string Base64 dari FileReader di FE
}