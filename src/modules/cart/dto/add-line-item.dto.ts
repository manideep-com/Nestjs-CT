import { IsString, IsNumber, Min, IsNotEmpty } from 'class-validator';

export class AddLineItemDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsNumber()
  @Min(1)
  variantId: number;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsNumber()
  @IsNotEmpty()
  version: number;
}
