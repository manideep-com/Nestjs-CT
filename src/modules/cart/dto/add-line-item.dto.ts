import { IsString, IsNumber, Min, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddLineItemDto {
  @ApiProperty({ 
    example: 'product-123-abc', 
    description: 'Product ID to add to cart' 
  })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({ 
    example: 1, 
    description: 'Product variant ID (usually 1 for main variant)' 
  })
  @IsNumber()
  @Min(1)
  variantId: number;

  @ApiProperty({ 
    example: 2, 
    description: 'Quantity of items to add' 
  })
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({ 
    example: 1, 
    description: 'Current version of the cart' 
  })
  @IsNumber()
  @IsNotEmpty()
  version: number;
}