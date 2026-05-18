import { IsString, IsOptional, MaxLength, IsNotEmpty } from 'class-validator';

export class CreateGuruDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  namaLengkap: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  nip?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  noTelepon?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  anakWali?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  mataPelajaran?: string;

  @IsOptional()
  @IsString()
  alamat?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  jabatan?: string;
}

export class UpdateGuruDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  namaLengkap?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  nip?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  noTelepon?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  anakWali?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  mataPelajaran?: string;

  @IsOptional()
  @IsString()
  alamat?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  jabatan?: string;
}
