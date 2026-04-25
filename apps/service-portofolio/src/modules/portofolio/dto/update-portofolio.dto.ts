import { PartialType } from '@nestjs/mapped-types';
import { CreatePortfolioDto } from './create-portofolio.dto';

export class UpdatePortfolioDto extends PartialType(CreatePortfolioDto) {}