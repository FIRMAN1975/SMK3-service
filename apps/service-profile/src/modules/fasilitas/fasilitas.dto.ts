import { IsString, IsOptional } from 'class-validator';

export class CreateFasilitasDto {
  @IsString()
  nama_fasilitas: string;

  @IsOptional()
  @IsString()
  deskripsi?: string;
}

export class UpdateFasilitasDto {
  @IsOptional()
  @IsString()
  nama_fasilitas?: string;

  @IsOptional()
  @IsString()
  deskripsi?: string;
}