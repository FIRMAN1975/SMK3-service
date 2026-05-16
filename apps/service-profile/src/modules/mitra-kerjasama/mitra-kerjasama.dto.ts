import { IsOptional, IsString, Length, MaxLength } from 'class-validator';

export class CreateMitraKerjasamaDto {
  @IsString()
  @Length(2, 150)
  nama_mitra: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  deskripsi?: string;
}

export class UpdateMitraKerjasamaDto {
  @IsOptional()
  @IsString()
  @Length(2, 150)
  nama_mitra?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  deskripsi?: string;
}
