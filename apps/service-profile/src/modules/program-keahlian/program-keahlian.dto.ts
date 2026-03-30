import { IsString, IsOptional } from 'class-validator';

export class CreateProgramKeahlianDto {
  @IsString()
  nama_jurusan: string;

  @IsOptional()
  @IsString()
  deskripsi?: string;

  @IsOptional()
  @IsString()
  icon?: string;
}

export class UpdateProgramKeahlianDto {
  @IsOptional()
  @IsString()
  nama_jurusan?: string;

  @IsOptional()
  @IsString()
  deskripsi?: string;

  @IsOptional()
  @IsString()
  icon?: string;
}