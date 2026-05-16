import { IsOptional, IsString } from 'class-validator';

export class GuruRequestDto {
  @IsOptional()
  @IsString()
  namaLengkap?: string;

  @IsOptional()
  @IsString()
  nip?: string;

  @IsOptional()
  @IsString()
  noTelepon?: string;

  @IsOptional()
  @IsString()
  anakWali?: string;

  @IsOptional()
  @IsString()
  mataPelajaran?: string;

  @IsOptional()
  @IsString()
  alamat?: string;

  @IsOptional()
  @IsString()
  jabatan?: string;
}