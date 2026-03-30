import { IsString, IsOptional } from 'class-validator';

export class CreateSejarahIdentitasDto {
  @IsOptional()
  @IsString()
  tahun_berdiri?: string;

  @IsString()
  deskripsi: string;
}

export class UpdateSejarahIdentitasDto {
  @IsOptional()
  @IsString()
  tahun_berdiri?: string;

  @IsOptional()
  @IsString()
  deskripsi?: string;
}