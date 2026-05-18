import { IsString, IsOptional, MaxLength, IsNotEmpty } from 'class-validator';

export class CreateSiswaDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  ownerUserId?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  namaLengkap: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  jurusan?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  nisn: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  nis?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  kelas: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  tanggalLahir?: string;

  @IsOptional()
  @IsString()
  alamat?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  noWaOrtu?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  status?: string;
}

export class UpdateSiswaDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  ownerUserId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  namaLengkap?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  jurusan?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  nisn?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  nis?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  kelas?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  tanggalLahir?: string;

  @IsOptional()
  @IsString()
  alamat?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  noWaOrtu?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  status?: string;

  @IsOptional()
  @IsString()
  raporFile?: string;

  @IsOptional()
  @IsString()
  sklFile?: string;

  @IsOptional()
  @IsString()
  ijazahFile?: string;
}
