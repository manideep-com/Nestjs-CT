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
    
      const cart = await this.getCart(cartId);
      
      this.logger.log(`Setting shipping address for cart: ${cartId}`);
      this.logger.log(`Current cart version: ${cart.version}`);
      this.logger.log(`Received version: ${addressDto.version}`);


      const address: any = {
        country: addressDto.country,
        city: addressDto.city,
        streetName: addressDto.streetName,
        postalCode: addressDto.postalCode,
      };

      
      if (addressDto.streetNumber) address.streetNumber = addressDto.streetNumber;
      if (addressDto.state) address.state = addressDto.state;
      if (addressDto.firstName) address.firstName = addressDto.firstName;
      if (addressDto.lastName) address.lastName = addressDto.lastName;
      if (addressDto.email) address.email = addressDto.email;
      if (addressDto.phone) address.phone = addressDto.phone;

      this.logger.debug(`Address payload: ${JSON.stringify(address)}`);

      const response = await this.ctService
        .getApiRoot()
        .carts()
        .withId({ ID: cartId })
        .post({
          body: {
            version: cart.version, 
            actions: [
              {
                action: 'setShippingAddress',
                address,
              },
            ],
          },
        })
        .execute();

      this.logger.log(`✅ Shipping address set successfully`);
      this.logger.log(`New version: ${response.body.version}`);
      return response.body;
    } catch (error) {
      this.logger.error('❌ Error setting shipping address');
      this.logger.error(`Cart ID: ${cartId}`);
      this.logger.error(`Status Code: ${error.statusCode}`);
      this.logger.error(`Error Body: ${JSON.stringify(error.body)}`);
      this.logger.error(`Error Message: ${error.message}`);

    
      const errorMessage = error.body?.message || error.message || 'Failed to set shipping address';
      throw new BadRequestException({
        statusCode: error.statusCode || 400,
        message: errorMessage,
        details: error.body || null,
      });
    }
  }

  async setBillingAddress(cartId: string, addressDto: SetAddressDto) {
    try {
    
      const cart = await this.getCart(cartId);
      
      this.logger.log(`Setting billing address for cart: ${cartId}`);
      this.logger.log(`Current cart version: ${cart.version}`);

      const address: any = {
        country: addressDto.country,
        city: addressDto.city,
        streetName: addressDto.streetName,
        postalCode: addressDto.postalCode,
      };

      if (addressDto.streetNumber) address.streetNumber = addressDto.streetNumber;
      if (addressDto.state) address.state = addressDto.state;
      if (addressDto.firstName) address.firstName = addressDto.firstName;
      if (addressDto.lastName) address.lastName = addressDto.lastName;
      if (addressDto.email) address.email = addressDto.email;
      if (addressDto.phone) address.phone = addressDto.phone;

      this.logger.debug(`Address payload: ${JSON.stringify(address)}`);

      const response = await this.ctService
        .getApiRoot()
        .carts()
        .withId({ ID: cartId })
        .post({
          body: {
            version: cart.version,
            actions: [
              {
                action: 'setBillingAddress',
                address,
              },
            ],
          },
        })
        .execute();

      this.logger.log(`✅ Billing address set successfully`);
      return response.body;
    } catch (error) {
      this.logger.error('❌ Error setting billing address');
      this.logger.error(`Error: ${JSON.stringify(error.body || error.message)}`);

      const errorMessage = error.body?.message || error.message || 'Failed to set billing address';
      throw new BadRequestException({
        statusCode: error.statusCode || 400,
        message: errorMessage,
        details: error.body || null,
      });
    }
  }

  async setShippingMethod(cartId: string, shippingMethodId: string, version: number) {
    try {
      
      const cart = await this.getCart(cartId);
      
      this.logger.log(`Setting shipping method for cart: ${cartId}`);
      this.logger.log(`Shipping method ID: ${shippingMethodId}`);

      const response = await this.ctService
        .getApiRoot()
        .carts()
        .withId({ ID: cartId })
        .post({
          body: {
            version: cart.version,
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

      this.logger.log(`✅ Shipping method set successfully`);
      return response.body;
    } catch (error) {
      this.logger.error('❌ Error setting shipping method');
      this.logger.error(`Error: ${JSON.stringify(error.body || error.message)}`);

      const errorMessage = error.body?.message || error.message || 'Failed to set shipping method';
      throw new BadRequestException({
        statusCode: error.statusCode || 400,
        message: errorMessage,
        details: error.body || null,
      });
    }
  }

  async createOrder(createOrderDto: CreateOrderDto) {
    try {
    
      const cart = await this.getCart(createOrderDto.cartId);
      
      this.logger.log(`Creating order for cart: ${createOrderDto.cartId}`);
      this.logger.log(`Cart version: ${cart.version}`);

      
      if (!cart.shippingAddress) {
        throw new BadRequestException('Cart must have a shipping address before creating an order');
      }

      if (cart.lineItems.length === 0) {
        throw new BadRequestException('Cart must have at least one line item');
      }

      const response = await this.ctService
        .getApiRoot()
        .orders()
        .post({
          body: {
            cart: {
              typeId: 'cart',
              id: createOrderDto.cartId,
            },
            version: cart.version,
          },
        })
        .execute();

      this.logger.log(`✅ Order created successfully: ${response.body.id}`);
      this.logger.log(`Order number: ${response.body.orderNumber || 'N/A'}`);
      return response.body;
    } catch (error) {
      this.logger.error('❌ Error creating order');
      this.logger.error(`Cart ID: ${createOrderDto.cartId}`);
      this.logger.error(`Error: ${JSON.stringify(error.body || error.message)}`);

      const errorMessage = error.body?.message || error.message || 'Failed to create order';
      throw new BadRequestException({
        statusCode: error.statusCode || 400,
        message: errorMessage,
        details: error.body || null,
      });
    }
  }

  async getOrderById(orderId: string) {
    try {
      this.logger.log(`Fetching order: ${orderId}`);
      
      const response = await this.ctService
        .getApiRoot()
        .orders()
        .withId({ ID: orderId })
        .get()
        .execute();

      this.logger.log(`✅ Order fetched successfully`);
      return response.body;
    } catch (error) {
      this.logger.error(`❌ Error fetching order: ${orderId}`);
      this.logger.error(`Error: ${JSON.stringify(error.body || error.message)}`);
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }
  }

  async getShippingMethods(cartId: string) {
    try {
      this.logger.log(`Fetching shipping methods for cart: ${cartId}`);
      
      const response = await this.ctService
        .getApiRoot()
        .shippingMethods()
        .matchingCart()
        .get({
          queryArgs: {
            cartId: cartId,
          },
        })
        .execute();

      this.logger.log(`✅ Found ${response.body.results.length} shipping methods`);
      return response.body;
    } catch (error) {
      this.logger.error('❌ Error fetching shipping methods');
      this.logger.error(`Error: ${JSON.stringify(error.body || error.message)}`);

      const errorMessage = error.body?.message || error.message || 'Failed to fetch shipping methods';
      throw new BadRequestException(errorMessage);
    }
  }

  
  private async getCart(cartId: string) {
    try {
      const response = await this.ctService
        .getApiRoot()
        .carts()
        .withId({ ID: cartId })
        .get()
        .execute();

      return response.body;
    } catch (error) {
      this.logger.error(`❌ Error fetching cart: ${cartId}`);
      throw new NotFoundException(`Cart with ID ${cartId} not found`);
    }
  }
}