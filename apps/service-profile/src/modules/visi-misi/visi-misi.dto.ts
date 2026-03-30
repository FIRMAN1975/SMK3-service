import { IsString, IsEnum, IsOptional } from 'class-validator';

export class CreateVisiMisiDto {
  @IsEnum(['visi', 'misi'])
  tipe: 'visi' | 'misi';

  @IsString()
  deskripsi: string;
}

export class UpdateVisiMisiDto {
  @IsOptional()
  @IsEnum(['visi', 'misi'])
  tipe?: 'visi' | 'misi';

  @IsOptional()
  @IsString()
  deskripsi?: string;
}