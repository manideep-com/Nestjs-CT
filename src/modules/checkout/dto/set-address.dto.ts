import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SetAddressDto {
  @ApiProperty({ 
    example: 'US', 
    description: 'Country code (ISO 3166-1 alpha-2)' 
  })
  @IsString()
  @IsNotEmpty()
  country: string;

  @ApiProperty({ 
    example: 'New York', 
    description: 'City name' 
  })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ 
    example: 'Main Road', 
    description: 'Street name' 
  })
  @IsString()
  @IsNotEmpty()
  streetName: string;

  @ApiPropertyOptional({ 
    example: '123', 
    description: 'Street number or building number' 
  })
  @IsOptional()
  @IsString()
  streetNumber?: string;

  @ApiProperty({ 
    example: '3001', 
    description: 'Postal/ZIP code' 
  })
  @IsString()
  @IsNotEmpty()
  postalCode: string;

  @ApiPropertyOptional({ 
    example: 'NY', 
    description: 'State or region' 
  })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional({ 
    example: 'John', 
    description: 'First name' 
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({ 
    example: 'Doe', 
    description: 'Last name' 
  })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional({ 
    example: 'john.doe@example.com', 
    description: 'Email address' 
  })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional({ 
    example: '+1 555-0123', 
    description: 'Phone number' 
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ 
    example: 1, 
    description: 'Current version of the cart' 
  })
  @IsNumber()
  @IsNotEmpty()
  version: number;
}