import { IsString, IsOptional, IsIn } from 'class-validator';

const JURUSAN_OPTIONS = [
  'Tataboga', 'Perhotelan', 'Teknik Komputer', 'Multimedia',
  'Akuntansi', 'Informatika', 'Administrasi Perkantoran', 'Pemasaran',
];

export class QueryPortfolioDto {
  @IsOptional()
  @IsString()
  @IsIn(JURUSAN_OPTIONS, { message: 'Jurusan tidak valid' })
  major?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  skill?: string;

  @IsOptional()
  @IsString()
  search?: string; // untuk search by title atau studentName
}