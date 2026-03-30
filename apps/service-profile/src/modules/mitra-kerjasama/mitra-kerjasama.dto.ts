import { IsString, IsOptional } from 'class-validator';

export class CreateMitraKerjasamaDto {
  @IsString()
  nama_mitra: string;

  @IsOptional()
  @IsString()
  deskripsi?: string;
}

export class UpdateMitraKerjasamaDto {
  @IsOptional()
  @IsString()
  nama_mitra?: string;

  @IsOptional()
  @IsString()
  deskripsi?: string;
}