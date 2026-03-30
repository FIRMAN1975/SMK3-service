import { IsString, IsEnum, IsOptional } from 'class-validator';

export class CreatePrestasiDto {
  @IsString()
  judul: string;

  @IsEnum(['kabupaten', 'provinsi', 'nasional', 'internasional'])
  tingkat: 'kabupaten' | 'provinsi' | 'nasional' | 'internasional';

  @IsString()
  tahun: string;

  @IsOptional()
  @IsString()
  keterangan?: string;
}

export class UpdatePrestasiDto {
  @IsOptional()
  @IsString()
  judul?: string;

  @IsOptional()
  @IsEnum(['kabupaten', 'provinsi', 'nasional', 'internasional'])
  tingkat?: 'kabupaten' | 'provinsi' | 'nasional' | 'internasional';

  @IsOptional()
  @IsString()
  tahun?: string;

  @IsOptional()
  @IsString()
  keterangan?: string;
}