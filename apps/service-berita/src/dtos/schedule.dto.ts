import {
  IsString,
  IsOptional,
  IsDate,
  IsEnum,
  MaxLength,
  Matches,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ScheduleCategory } from '../entities';

export class CreateScheduleDto {
  @IsString()
  @MaxLength(255)
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @Type(() => Date)
  @IsDate()
  date: Date;

  @IsOptional()
  @Matches(/^([0-1]\d|2[0-3]):[0-5]\d$/, {
    message: 'Format waktu harus HH:mm',
  })
  startTime?: string;

  @IsOptional()
  @Matches(/^([0-1]\d|2[0-3]):[0-5]\d$/, {
    message: 'Format waktu harus HH:mm',
  })
  endTime?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  location?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  participants?: string;

  @IsOptional()
  @IsEnum(ScheduleCategory)
  category?: ScheduleCategory;

  @IsOptional()
  @IsString()
  imageUrl?: string;
}

export class UpdateScheduleDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  date?: Date;

  @IsOptional()
  @Matches(/^([0-1]\d|2[0-3]):[0-5]\d$/)
  startTime?: string;

  @IsOptional()
  @Matches(/^([0-1]\d|2[0-3]):[0-5]\d$/)
  endTime?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  location?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  participants?: string;

  @IsOptional()
  @IsEnum(ScheduleCategory)
  category?: ScheduleCategory;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class ScheduleResponseDto {
  id: number;
  title: string;
  description?: string;
  date: Date;
  startTime?: string;
  endTime?: string;
  location?: string;
  participants?: string;
  category: ScheduleCategory;
  imageUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}