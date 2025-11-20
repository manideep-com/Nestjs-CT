import { IsString, IsNumber, Min, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateLineItemDto {
  @ApiProperty({ 
    example: 'line-item-123', 
    description: 'Line item ID to update' 
  })
  @IsString()
  @IsNotEmpty()
  lineItemId: string;

  @ApiProperty({ 
    example: 3, 
    description: 'New quantity (0 to remove item)' 
  })
  @IsNumber()
  @Min(0)
  quantity: number;

  @ApiProperty({ 
    example: 2, 
    description: 'Current version of the cart' 
  })
  @IsNumber()
  @IsNotEmpty()
  version: number;
}