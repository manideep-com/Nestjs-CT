import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { CheckoutService } from './checkout.service';
import { SetAddressDto } from './dto/set-address.dto';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('checkout')
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @Post('carts/:id/shipping-address')
  setShippingAddress(
    @Param('id') id: string,
    @Body() addressDto: SetAddressDto,
  ) {
    return this.checkoutService.setShippingAddress(id, addressDto);
  }

  @Post('carts/:id/billing-address')
  setBillingAddress(
    @Param('id') id: string,
    @Body() addressDto: SetAddressDto,
  ) {
    return this.checkoutService.setBillingAddress(id, addressDto);
  }

  @Post('carts/:id/shipping-method')
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
  createOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.checkoutService.createOrder(createOrderDto);
  }

  @Get('orders/:id')
  getOrderById(@Param('id') id: string) {
    return this.checkoutService.getOrderById(id);
  }
}