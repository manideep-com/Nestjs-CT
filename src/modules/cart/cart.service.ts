import { Injectable, NotFoundException, Logger, BadRequestException } from '@nestjs/common';
import { CommercetoolsService } from '../../common/commercetools/commercetools.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { AddLineItemDto } from './dto/add-line-item.dto';
import { UpdateLineItemDto } from './dto/update-line-item.dto';

@Injectable()
export class CartService {
  private readonly logger = new Logger(CartService.name);

  constructor(private readonly ctService: CommercetoolsService) {}

  async createCart(createCartDto: CreateCartDto) {
    try {
      this.logger.log(`Creating cart with currency: ${createCartDto.currency}`);
      this.logger.log(`Country: ${createCartDto.country || 'US'}`);
      
      const cartDraft: any = {
        currency: createCartDto.currency || 'USD',
        country: createCartDto.country || 'US',
      };

      if (createCartDto.customerId) {
        cartDraft.customerId = createCartDto.customerId;
        this.logger.log(`Cart for customer: ${createCartDto.customerId}`);
      }

      const response = await this.ctService
        .getApiRoot()
        .carts()
        .post({ body: cartDraft })
        .execute();

      this.logger.log(`✅ Cart created successfully: ${response.body.id}`);
      return response.body;
    } catch (error) {
      this.logger.error('❌ Error creating cart');
      this.logger.error(`Error: ${JSON.stringify(error.body || error.message)}`);
      throw new BadRequestException(
        error.body?.message || error.message || 'Failed to create cart',
      );
    }
  }

  async getCartById(id: string) {
    try {
      this.logger.log(`Fetching cart: ${id}`);
      
      const response = await this.ctService
        .getApiRoot()
        .carts()
        .withId({ ID: id })
        .get()
        .execute();

      this.logger.log(`✅ Cart fetched successfully: ${id}`);
      return response.body;
    } catch (error) {
      this.logger.error(`❌ Error fetching cart: ${id}`);
      this.logger.error(`Error: ${JSON.stringify(error.body || error.message)}`);
      throw new NotFoundException(`Cart with ID ${id} not found`);
    }
  }

  async addLineItem(cartId: string, addLineItemDto: AddLineItemDto) {
    try {
      this.logger.log(`Adding line item to cart: ${cartId}`);
      this.logger.log(`Product ID: ${addLineItemDto.productId}`);
      this.logger.log(`Variant ID: ${addLineItemDto.variantId || 1}`);
      this.logger.log(`Quantity: ${addLineItemDto.quantity}`);
      this.logger.log(`Cart Version: ${addLineItemDto.version}`);


      const cart = await this.getCartById(cartId);
      const country = cart.country || 'US';
      
      this.logger.log(`Cart country: ${country}`);

      const response = await this.ctService
        .getApiRoot()
        .carts()
        .withId({ ID: cartId })
        .post({
          body: {
            version: addLineItemDto.version,
            actions: [
              {
                action: 'addLineItem',
                productId: addLineItemDto.productId,
                variantId: addLineItemDto.variantId || 1,
                quantity: addLineItemDto.quantity,
              },
            ],
          },
        })
        .execute();

      this.logger.log('✅ Line item added successfully');
      this.logger.log(`New cart version: ${response.body.version}`);
      this.logger.log(`Line items count: ${response.body.lineItems.length}`);
      
      return response.body;
    } catch (error) {
      this.logger.error('❌ Error adding line item to cart');
      this.logger.error(`Cart ID: ${cartId}`);
      this.logger.error(`Product ID: ${addLineItemDto.productId}`);
      this.logger.error(`Error Status: ${error.statusCode}`);
      this.logger.error(`Error Body: ${JSON.stringify(error.body)}`);
      this.logger.error(`Error Message: ${error.message}`);
      
  
      const errorMessage = error.body?.message || error.message || 'Failed to add line item to cart';
      throw new BadRequestException(errorMessage);
    }
  }

  async removeLineItem(cartId: string, lineItemId: string, version: number) {
    try {
      this.logger.log(`Removing line item: ${lineItemId} from cart: ${cartId}`);
      
      const response = await this.ctService
        .getApiRoot()
        .carts()
        .withId({ ID: cartId })
        .post({
          body: {
            version,
            actions: [
              {
                action: 'removeLineItem',
                lineItemId,
              },
            ],
          },
        })
        .execute();

      this.logger.log('✅ Line item removed successfully');
      return response.body;
    } catch (error) {
      this.logger.error('❌ Error removing line item');
      this.logger.error(`Error: ${JSON.stringify(error.body || error.message)}`);
      throw new BadRequestException(
        error.body?.message || error.message || 'Failed to remove line item from cart',
      );
    }
  }

  async updateLineItemQuantity(cartId: string, updateDto: UpdateLineItemDto) {
    try {
      this.logger.log(`Updating line item quantity in cart: ${cartId}`);
      this.logger.log(`Line Item ID: ${updateDto.lineItemId}`);
      this.logger.log(`New Quantity: ${updateDto.quantity}`);
      
      const response = await this.ctService
        .getApiRoot()
        .carts()
        .withId({ ID: cartId })
        .post({
          body: {
            version: updateDto.version,
            actions: [
              {
                action: 'changeLineItemQuantity',
                lineItemId: updateDto.lineItemId,
                quantity: updateDto.quantity,
              },
            ],
          },
        })
        .execute();

      this.logger.log('✅ Line item quantity updated successfully');
      return response.body;
    } catch (error) {
      this.logger.error('❌ Error updating line item quantity');
      this.logger.error(`Error: ${JSON.stringify(error.body || error.message)}`);
      throw new BadRequestException(
        error.body?.message || error.message || 'Failed to update line item quantity',
      );
    }
  }

  async applyDiscountCode(cartId: string, code: string, version: number) {
    try {
      this.logger.log(`Applying discount code: ${code} to cart: ${cartId}`);
      
      const response = await this.ctService
        .getApiRoot()
        .carts()
        .withId({ ID: cartId })
        .post({
          body: {
            version,
            actions: [
              {
                action: 'addDiscountCode',
                code,
              },
            ],
          },
        })
        .execute();

      this.logger.log('✅ Discount code applied successfully');
      return response.body;
    } catch (error) {
      this.logger.error('❌ Error applying discount code');
      this.logger.error(`Error: ${JSON.stringify(error.body || error.message)}`);
      throw new BadRequestException(
        error.body?.message || error.message || 'Failed to apply discount code',
      );
    }
  }
}