import {
  IsString,
  IsOptional,
  IsBoolean,
  IsEnum,
  Length,
  IsISO8601,
} from 'class-validator';
import { AnnouncementType } from '../entities/announcement.entity';

export class CreateAnnouncementDto {
  @IsString()
  @Length(5, 255)
  title: string;

  @IsString()
  @Length(10)
  content: string;

  @IsEnum(AnnouncementType)
  type: AnnouncementType;

  @IsOptional()
  @IsString()
  author?: string;

  @IsOptional()
  @IsISO8601()
  expiredAt?: string;
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
  @IsEnum(AnnouncementType)
  type?: AnnouncementType;

  @IsOptional()
  @IsString()
  author?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsISO8601()
  expiredAt?: string;
}

export class AnnouncementResponseDto {
  id: string;
  title: string;
  content: string;
  type: AnnouncementType;
  author?: string;
  isActive: boolean;
  expiredAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
