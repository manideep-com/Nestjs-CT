import { Controller, Get, Post, Delete, Patch, Param, Body, Query } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { AddLineItemDto } from './dto/add-line-item.dto';
import { UpdateLineItemDto } from './dto/update-line-item.dto';

@Controller('carts')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  createCart(@Body() createCartDto: CreateCartDto) {
    return this.cartService.createCart(createCartDto);
  }

  @Get(':id')
  getCartById(@Param('id') id: string) {
    return this.cartService.getCartById(id);
  }

  @Post(':id/line-items')
  addLineItem(@Param('id') id: string, @Body() addLineItemDto: AddLineItemDto) {
    return this.cartService.addLineItem(id, addLineItemDto);
  }

  @Delete(':id/line-items/:lineItemId')
  removeLineItem(
    @Param('id') id: string,
    @Param('lineItemId') lineItemId: string,
    @Query('version') version: number,
  ) {
    return this.cartService.removeLineItem(id, lineItemId, version);
  }

  @Patch(':id/line-items')
  updateLineItemQuantity(
    @Param('id') id: string,
    @Body() updateDto: UpdateLineItemDto,
  ) {
    return this.cartService.updateLineItemQuantity(id, updateDto);
  }

  @Post(':id/discount-codes')
  applyDiscountCode(
    @Param('id') id: string,
    @Body() body: { code: string; version: number },
  ) {
    return this.cartService.applyDiscountCode(id, body.code, body.version);
  }
}