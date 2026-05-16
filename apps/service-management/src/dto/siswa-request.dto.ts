import { IsOptional, IsString } from 'class-validator';

export class SiswaRequestDto {
  @IsOptional()
  @IsString()
  namaLengkap?: string;

  @IsOptional()
  @IsString()
  jurusan?: string;

  @IsOptional()
  @IsString()
  nisn?: string;

  @IsOptional()
  @IsString()
  nis?: string;

  @IsOptional()
  @IsString()
  kelas?: string;

  @IsOptional()
  @IsString()
  tanggalLahir?: string;

  @IsOptional()
  @IsString()
  alamat?: string;

  @IsOptional()
  @IsString()
  noWaOrtu?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  raporFile?: string;

  @IsOptional()
  @IsString()
  sklFile?: string;

  @IsOptional()
  @IsString()
  ijazahFile?: string;
}