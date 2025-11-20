import { Controller, Post, Get, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody } from '@nestjs/swagger';
import { CheckoutService } from './checkout.service';
import { SetAddressDto } from './dto/set-address.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { AuthGuard } from '../../common/auth/auth.guard';

@ApiTags('Checkout')
@Controller('checkout')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @Post('carts/:id/shipping-address')
  @ApiOperation({ 
    summary: 'Set shipping address',
    description: 'Set the shipping address for the cart before checkout'
  })
  @ApiParam({ name: 'id', description: 'Cart ID', example: 'cart-123-abc' })
  @ApiResponse({ 
    status: 200, 
    description: 'Shipping address set successfully',
    schema: {
      example: {
        id: 'cart-123',
        version: 2,
        shippingAddress: {
          country: 'US',
          city: 'New York',
          streetName: '5th Avenue',
          postalCode: '3001'
        }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Invalid address data or version mismatch' })
  @ApiResponse({ status: 404, description: 'Cart not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  setShippingAddress(
    @Param('id') id: string,
    @Body() addressDto: SetAddressDto,
  ) {
    return this.checkoutService.setShippingAddress(id, addressDto);
  }

  @Post('carts/:id/billing-address')
  @ApiOperation({ 
    summary: 'Set billing address',
    description: 'Set the billing address for payment processing'
  })
  @ApiParam({ name: 'id', description: 'Cart ID' })
  @ApiResponse({ status: 200, description: 'Billing address set successfully' })
  @ApiResponse({ status: 400, description: 'Invalid address data' })
  @ApiResponse({ status: 404, description: 'Cart not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  setBillingAddress(
    @Param('id') id: string,
    @Body() addressDto: SetAddressDto,
  ) {
    return this.checkoutService.setBillingAddress(id, addressDto);
  }

  @Get('carts/:id/shipping-methods')
  @ApiOperation({ 
    summary: 'Get available shipping methods',
    description: 'Retrieve all shipping methods available for the cart based on shipping address and cart contents'
  })
  @ApiParam({ name: 'id', description: 'Cart ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Shipping methods retrieved successfully',
    schema: {
      example: {
        results: [
          {
            id: 'shipping-method-1',
            name: 'Standard Shipping',
            description: 'Delivery in 5-7 business days',
            zoneRates: [
              {
                zone: { id: 'zone-1' },
                shippingRates: [
                  { price: { centAmount: 500, currencyCode: 'USD' } }
                ]
              }
            ]
          }
        ]
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Cart not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getShippingMethods(@Param('id') id: string) {
    return this.checkoutService.getShippingMethods(id);
  }

  @Post('carts/:id/shipping-method')
  @ApiOperation({ 
    summary: 'Set shipping method',
    description: 'Select a shipping method for the cart'
  })
  @ApiParam({ name: 'id', description: 'Cart ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        shippingMethodId: { type: 'string', example: 'shipping-method-123' },
        version: { type: 'number', example: 3 }
      },
      required: ['shippingMethodId', 'version']
    }
  })
  @ApiResponse({ status: 200, description: 'Shipping method set successfully' })
  @ApiResponse({ status: 400, description: 'Invalid shipping method or version' })
  @ApiResponse({ status: 404, description: 'Cart not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  setShippingMethod(
    @Param('id') id: string,
    @Body() body: { shippingMethodId: string; version: number },
  ) {
    return this.checkoutService.setShippingMethod(
      id,
      body.shippingMethodId,
      body.version,
    );
  }

  @Post('orders')
  @ApiOperation({ 
    summary: 'Create order from cart',
    description: 'Convert the cart into an order. Cart must have shipping address and at least one line item.'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Order created successfully',
    schema: {
      example: {
        id: 'order-123',
        version: 1,
        orderNumber: 'ORD-2024-001',
        orderState: 'Open',
        totalPrice: { centAmount: 19998, currencyCode: 'USD' },
        lineItems: [],
        shippingAddress: {},
        createdAt: '2024-11-19T10:00:00.000Z'
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Cart validation failed (missing address or items)' })
  @ApiResponse({ status: 404, description: 'Cart not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  createOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.checkoutService.createOrder(createOrderDto);
  }

  @Get('orders/:id')
  @ApiOperation({ 
    summary: 'Get order by ID',
    description: 'Retrieve complete order details including items, addresses, and status'
  })
  @ApiParam({ name: 'id', description: 'Order ID', example: 'order-123-abc' })
  @ApiResponse({ status: 200, description: 'Order retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getOrderById(@Param('id') id: string) {
    return this.checkoutService.getOrderById(id);
  }
}