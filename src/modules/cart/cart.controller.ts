import { Controller, Get, Post, Delete, Patch, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { AddLineItemDto } from './dto/add-line-item.dto';
import { UpdateLineItemDto } from './dto/update-line-item.dto';
import { AuthGuard } from '../../common/auth/auth.guard';

@ApiTags('Cart')
@Controller('carts')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Create new cart',
    description: 'Create a new shopping cart for the user. Can be anonymous or associated with a customer.'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Cart created successfully',
    schema: {
      example: {
        id: 'cart-123',
        version: 1,
        lineItems: [],
        totalPrice: { centAmount: 0, currencyCode: 'USD' },
        currency: 'USD',
        country: 'US'
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  createCart(@Body() createCartDto: CreateCartDto) {
    return this.cartService.createCart(createCartDto);
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Get cart by ID',
    description: 'Retrieve cart details including line items, prices, and shipping information'
  })
  @ApiParam({ name: 'id', description: 'Cart ID', example: 'cart-123-abc' })
  @ApiResponse({ status: 200, description: 'Cart retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Cart not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getCartById(@Param('id') id: string) {
    return this.cartService.getCartById(id);
  }

  @Post(':id/line-items')
  @ApiOperation({ 
    summary: 'Add item to cart',
    description: 'Add a product variant with specified quantity to the cart'
  })
  @ApiParam({ name: 'id', description: 'Cart ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Item added to cart successfully',
    schema: {
      example: {
        id: 'cart-123',
        version: 2,
        lineItems: [
          {
            id: 'line-item-1',
            productId: 'product-123',
            quantity: 2,
            totalPrice: { centAmount: 19998, currencyCode: 'USD' }
          }
        ]
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Invalid product or cart version mismatch' })
  @ApiResponse({ status: 404, description: 'Cart not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  addLineItem(@Param('id') id: string, @Body() addLineItemDto: AddLineItemDto) {
    return this.cartService.addLineItem(id, addLineItemDto);
  }

  @Delete(':id/line-items/:lineItemId')
  @ApiOperation({ 
    summary: 'Remove item from cart',
    description: 'Remove a specific line item from the cart'
  })
  @ApiParam({ name: 'id', description: 'Cart ID' })
  @ApiParam({ name: 'lineItemId', description: 'Line item ID to remove' })
  @ApiResponse({ status: 200, description: 'Item removed successfully' })
  @ApiResponse({ status: 400, description: 'Invalid version or line item' })
  @ApiResponse({ status: 404, description: 'Cart not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  removeLineItem(
    @Param('id') id: string,
    @Param('lineItemId') lineItemId: string,
    @Query('version') version: number,
  ) {
    return this.cartService.removeLineItem(id, lineItemId, version);
  }

  @Patch(':id/line-items')
  @ApiOperation({ 
    summary: 'Update line item quantity',
    description: 'Change the quantity of a specific line item in the cart'
  })
  @ApiParam({ name: 'id', description: 'Cart ID' })
  @ApiResponse({ status: 200, description: 'Quantity updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid quantity or version' })
  @ApiResponse({ status: 404, description: 'Cart not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  updateLineItemQuantity(
    @Param('id') id: string,
    @Body() updateDto: UpdateLineItemDto,
  ) {
    return this.cartService.updateLineItemQuantity(id, updateDto);
  }

  @Post(':id/discount-codes')
  @ApiOperation({ 
    summary: 'Apply discount code',
    description: 'Apply a promotional discount code to the cart'
  })
  @ApiParam({ name: 'id', description: 'Cart ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        code: { type: 'string', example: 'SUMMER2024' },
        version: { type: 'number', example: 3 }
      }
    }
  })
  @ApiResponse({ status: 200, description: 'Discount code applied successfully' })
  @ApiResponse({ status: 400, description: 'Invalid discount code or version' })
  @ApiResponse({ status: 404, description: 'Cart not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  applyDiscountCode(
    @Param('id') id: string,
    @Body() body: { code: string; version: number },
  ) {
    return this.cartService.applyDiscountCode(id, body.code, body.version);
  }
}