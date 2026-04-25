import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  Length,
  MaxLength,
} from 'class-validator';

export class CreateNewsDto {
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
  @IsString()
  @MaxLength(500)
  excerpt?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  author?: string;

  @IsOptional()
  @IsNumber()
  categoryId?: number;

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;
}

export class UpdateNewsDto {
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
  @IsString()
  @MaxLength(500)
  excerpt?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  author?: string;

  @IsOptional()
  @IsNumber()
  categoryId?: number;

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class NewsResponseDto {
  id: number;
  title: string;
  content: string;
  excerpt?: string;
  slug: string;
  imageUrl?: string;
  author?: string;
  views: number;
  isFeatured: boolean;
  isActive: boolean;
  category?: any;
  createdAt: Date;
  updatedAt: Date;
}
