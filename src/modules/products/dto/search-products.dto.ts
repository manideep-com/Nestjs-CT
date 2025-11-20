import { IsOptional, IsString, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class SearchProductsDto {
  @ApiPropertyOptional({ 
    example: 'laptop', 
    description: 'Search term to filter products' 
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ 
    example: 'electronics-123', 
    description: 'Category ID to filter products' 
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ 
    example: 1000, 
    description: 'Minimum price in cents' 
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  minPrice?: number;

  @ApiPropertyOptional({ 
    example: 50000, 
    description: 'Maximum price in cents' 
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  maxPrice?: number;

  @ApiPropertyOptional({ 
    example: 20, 
    description: 'Number of results to return',
    default: 20
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  limit?: number = 20;

  @ApiPropertyOptional({ 
    example: 0, 
    description: 'Number of results to skip',
    default: 0
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  offset?: number = 0;
}