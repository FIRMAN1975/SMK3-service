import { IsString, Length } from 'class-validator';

export class RejectPortfolioDto {
  @IsString()
  @Length(5, 500)
  reason: string;
}
