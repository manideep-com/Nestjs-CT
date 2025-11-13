import { IsOptional } from 'class-validator';
import { IsString } from 'class-validator';
import { IsNumber } from 'class-validator';
import { Min } from 'class-validator';
import { Type } from 'class-transformer';

export class SearchProductsDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  minPrice?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  maxPrice?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  limit?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  offset?: number;

  constructor() {
    this.limit = 20;
    this.offset = 0;
  }
}