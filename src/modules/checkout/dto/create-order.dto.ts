import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({ 
    example: 'cart-123-abc', 
    description: 'Cart ID to create order from' 
  })
  @IsString()
  @IsNotEmpty()
  cartId: string;

  @ApiProperty({ 
    example: 5, 
    description: 'Current version of the cart' 
  })
  @IsNumber()
  @IsNotEmpty()
  version: number;
}