import { IsOptional, IsString, Length, MaxLength } from 'class-validator';

export class CreateProgramKeahlianDto {
  @IsString()
  @Length(2, 100)
  nama_jurusan: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  deskripsi?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  icon?: string;
}

export class UpdateProgramKeahlianDto {
  @IsOptional()
  @IsString()
  @Length(2, 100)
  nama_jurusan?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  deskripsi?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  icon?: string;
}
