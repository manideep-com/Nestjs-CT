import { IsOptional, IsString } from 'class-validator';

export class CreateCartDto {
  @IsOptional()
  @IsString()
  currency?: string = 'AUD';

  @IsOptional()
  @IsString()
  customerId?: string;
}