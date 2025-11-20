import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCartDto {
  @ApiPropertyOptional({ 
    example: 'USD', 
    description: 'Currency code (ISO 4217)',
    default: 'USD'
  })
  @IsOptional()
  @IsString()
  currency?: string = 'USD';

  @ApiPropertyOptional({ 
    example: 'US', 
    description: 'Country code (ISO 3166-1 alpha-2)',
    default: 'US'
  })
  @IsOptional()
  @IsString()
  country?: string = 'US';

  @ApiPropertyOptional({ 
    example: 'customer-123', 
    description: 'Customer ID (optional, for registered users)' 
  })
  @IsOptional()
  @IsString()
  customerId?: string;
}