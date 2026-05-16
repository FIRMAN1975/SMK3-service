import {
  IsString,
  IsOptional,
  IsBoolean,
  IsEnum,
  Length,
  MaxLength,
  IsDate,
  IsUrl,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AnnouncementType } from '../entities';

export class CreateAnnouncementDto {
  @IsString()
  @Length(5, 255)
  title: string;

  @IsString()
  @Length(10)
  content: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @IsOptional()
  @IsEnum(AnnouncementType)
  type?: AnnouncementType;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  author?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  expiredAt?: Date;
}

export class UpdateAnnouncementDto {
  @IsOptional()
  @IsString()
  @Length(5, 255)
  title?: string;

  @IsOptional()
  @IsString()
  @Length(10)
  content?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @IsOptional()
  @IsEnum(AnnouncementType)
  type?: AnnouncementType;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  author?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  expiredAt?: Date;
}

export class AnnouncementResponseDto {
  id: number;
  title: string;
  content: string;
  type: AnnouncementType;
  author?: string;
  isActive: boolean;
  expiredAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}