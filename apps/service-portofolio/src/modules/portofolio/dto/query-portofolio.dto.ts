import { Type } from 'class-transformer';
import { IsEnum, IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { PortfolioStatus } from '../../../models/PortofolioModel';

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

  @IsOptional()
  @IsEnum(PortfolioStatus)
  status?: PortfolioStatus;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number = 10;
}
