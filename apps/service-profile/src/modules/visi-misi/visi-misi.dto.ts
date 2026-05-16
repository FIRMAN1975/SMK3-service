import { IsIn, IsOptional, IsString, Length } from 'class-validator';

export class CreateVisiMisiDto {
  @IsIn(['visi', 'misi'])
  tipe: 'visi' | 'misi';

  @IsString()
  @Length(10)
  deskripsi: string;
}

export class UpdateVisiMisiDto {
  @IsOptional()
  @IsIn(['visi', 'misi'])
  tipe?: 'visi' | 'misi';

  @IsOptional()
  @IsString()
  @Length(10)
  deskripsi?: string;
}
