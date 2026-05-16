import { IsOptional, IsString, Length, MaxLength } from 'class-validator';

export class CreateFasilitasDto {
  @IsString()
  @Length(2, 100)
  nama_fasilitas: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  deskripsi?: string;
}

export class UpdateFasilitasDto {
  @IsOptional()
  @IsString()
  @Length(2, 100)
  nama_fasilitas?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  deskripsi?: string;
}
