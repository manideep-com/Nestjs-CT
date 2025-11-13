import { IsString, IsNumber, Min, IsNotEmpty } from 'class-validator';

export class UpdateLineItemDto {
  @IsString()
  @IsNotEmpty()
  lineItemId: string;

  @IsNumber()
  @Min(0)
  quantity: number;

  @IsNumber()
  @IsNotEmpty()
  version: number;
}