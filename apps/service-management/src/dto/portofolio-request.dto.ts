import { IsOptional, IsString } from 'class-validator';

export class PortofolioRequestDto {
  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;
}
