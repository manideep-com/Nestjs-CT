import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  cartId: string;

  @IsNumber()
  @IsNotEmpty()
  version: number;
}