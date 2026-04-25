import {
  IsString,
  IsOptional,
  IsDate,
  IsEnum,
  IsNotEmpty,
  MaxLength,
  Matches,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ScheduleCategory } from '../entities/schedule.entity';

export class CreateScheduleDto {
  @IsString()
  @IsNotEmpty({ message: 'Judul agenda wajib diisi' })
  @MaxLength(255)
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsNotEmpty({ message: 'Tanggal wajib diisi' })
  @Type(() => Date)
  @IsDate({ message: 'Format tanggal tidak valid' })
  date: Date;

  @IsOptional()
  @Matches(/^([0-1]{1}[0-9]{1}|2[0-3]{1}):[0-5]{1}[0-9]{1}$/, {
    message: 'Format waktu harus HH:mm',
  })
  startTime: string;

  @IsOptional()
  @Matches(/^([0-1]{1}[0-9]{1}|2[0-3]{1}):[0-5]{1}[0-9]{1}$/, {
    message: 'Format waktu harus HH:mm',
  })
  endTime: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  location: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  participants: string;

  @IsEnum(ScheduleCategory)
  @IsOptional()
  category: ScheduleCategory = ScheduleCategory.KEGIATAN;

  @IsString()
  @IsOptional()
  imageUrl: string = '';
}

export class UpdateScheduleDto {
  @IsString()
  @IsOptional()
  @MaxLength(255)
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'Format tanggal tidak valid' })
  date: Date;

  @IsOptional()
  @Matches(/^([0-1]{1}[0-9]{1}|2[0-3]{1}):[0-5]{1}[0-9]{1}$/, {
    message: 'Format waktu harus HH:mm',
  })
  startTime: string;

  @IsOptional()
  @Matches(/^([0-1]{1}[0-9]{1}|2[0-3]{1}):[0-5]{1}[0-9]{1}$/, {
    message: 'Format waktu harus HH:mm',
  })
  endTime: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  location: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  participants: string;

  @IsEnum(ScheduleCategory)
  @IsOptional()
  category: ScheduleCategory;

  @IsString()
  @IsOptional()
  imageUrl: string;

  @IsOptional()
  isActive: boolean;
}

export class ScheduleResponseDto {
  id: number;
  title: string;
  description: string;
  date: Date;
  startTime: string;
  endTime: string;
  location: string;
  participants: string;
  category: ScheduleCategory;
  imageUrl: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
