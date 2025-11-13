import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { CommercetoolsService } from '../../common/commercetools/commercetools.service';
import { SetAddressDto } from './dto/set-address.dto';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class CheckoutService {
  private readonly logger = new Logger(CheckoutService.name);

  constructor(private readonly ctService: CommercetoolsService) {}

  async setShippingAddress(cartId: string, addressDto: SetAddressDto) {
    try {
      const address = {
        country: addressDto.country,
        city: addressDto.city,
        streetName: addressDto.streetName,
        streetNumber: addressDto.streetNumber,
        postalCode: addressDto.postalCode,
        state: addressDto.state,
        firstName: addressDto.firstName,
        lastName: addressDto.lastName,
        email: addressDto.email,
        phone: addressDto.phone,
      };

      const response = await this.ctService
        .getApiRoot()
        .carts()
        .withId({ ID: cartId })
        .post({
          body: {
            version: addressDto.version,
            actions: [
              {
                action: 'setShippingAddress',
                address,
              },
            ],
          },
        })
        .execute();

      return response.body;
    } catch (error) {
      this.logger.error('Error setting shipping address', error);
      throw new BadRequestException('Failed to set shipping address');
    }
  }

  async setBillingAddress(cartId: string, addressDto: SetAddressDto) {
    try {
      const address = {
        country: addressDto.country,
        city: addressDto.city,
        streetName: addressDto.streetName,
        streetNumber: addressDto.streetNumber,
        postalCode: addressDto.postalCode,
        state: addressDto.state,
        firstName: addressDto.firstName,
        lastName: addressDto.lastName,
        email: addressDto.email,
        phone: addressDto.phone,
      };

      const response = await this.ctService
        .getApiRoot()
        .carts()
        .withId({ ID: cartId })
        .post({
          body: {
            version: addressDto.version,
            actions: [
              {
                action: 'setBillingAddress',
                address,
              },
            ],
          },
        })
        .execute();

      return response.body;
    } catch (error) {
      this.logger.error('Error setting billing address', error);
      throw new BadRequestException('Failed to set billing address');
    }
  }

  async setShippingMethod(cartId: string, shippingMethodId: string, version: number) {
    try {
      const response = await this.ctService
        .getApiRoot()
        .carts()
        .withId({ ID: cartId })
        .post({
          body: {
            version,
            actions: [
              {
                action: 'setShippingMethod',
                shippingMethod: {
                  typeId: 'shipping-method',
                  id: shippingMethodId,
                },
              },
            ],
          },
        })
        .execute();

      return response.body;
    } catch (error) {
      this.logger.error('Error setting shipping method', error);
      throw new BadRequestException('Failed to set shipping method');
    }
  }

  async createOrder(createOrderDto: CreateOrderDto) {
    try {
      const response = await this.ctService
        .getApiRoot()
        .orders()
        .post({
          body: {
            cart: {
              typeId: 'cart',
              id: createOrderDto.cartId,
            },
            version: createOrderDto.version,
          },
        })
        .execute();

      return response.body;
    } catch (error) {
      this.logger.error('Error creating order', error);
      throw new BadRequestException('Failed to create order');
    }
  }

  async getOrderById(orderId: string) {
    try {
      const response = await this.ctService
        .getApiRoot()
        .orders()
        .withId({ ID: orderId })
        .get()
        .execute();

      return response.body;
    } catch (error) {
      this.logger.error(`Error fetching order: ${orderId}`, error);
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }
  }
}