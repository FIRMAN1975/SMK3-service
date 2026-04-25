import {
  IsString,
  IsOptional,
  IsBoolean,
  IsEnum,
  Length,
  IsNumber,
} from 'class-validator';
import { ContactType } from '../entities/contact.entity';

export class CreateContactDto {
  @IsString()
  @Length(1, 50)
  label: string;

  @IsEnum(ContactType)
  type: ContactType;

  @IsString()
  @Length(1, 500)
  value: string;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsOptional()
  @IsNumber()
  order?: number;
}

export class UpdateContactDto {
  @IsOptional()
  @IsString()
  @Length(1, 50)
  label?: string;

  @IsOptional()
  @IsEnum(ContactType)
  type?: ContactType;

  @IsOptional()
  @IsString()
  @Length(1, 500)
  value?: string;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsOptional()
  @IsNumber()
  order?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class ContactResponseDto {
  id: number;
  label: string;
  type: ContactType;
  value: string;
  icon?: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
