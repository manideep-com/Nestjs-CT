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
      const cartDraft: any = {
        currency: createCartDto.currency,
      };

      if (createCartDto.customerId) {
        cartDraft.customerId = createCartDto.customerId;
      }

      const response = await this.ctService
        .getApiRoot()
        .carts()
        .post({ body: cartDraft })
        .execute();

      return response.body;
    } catch (error) {
      this.logger.error('Error creating cart', error);
      throw error;
    }
  }

  async getCartById(id: string) {
    try {
      const response = await this.ctService
        .getApiRoot()
        .carts()
        .withId({ ID: id })
        .get()
        .execute();

      return response.body;
    } catch (error) {
      this.logger.error(`Error fetching cart: ${id}`, error);
      throw new NotFoundException(`Cart with ID ${id} not found`);
    }
  }

  async addLineItem(cartId: string, addLineItemDto: AddLineItemDto) {
    try {
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
                variantId: addLineItemDto.variantId,
                quantity: addLineItemDto.quantity,
              },
            ],
          },
        })
        .execute();

      return response.body;
    } catch (error) {
      this.logger.error('Error adding line item', error);
      throw new BadRequestException('Failed to add line item to cart');
    }
  }

  async removeLineItem(cartId: string, lineItemId: string, version: number) {
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
                action: 'removeLineItem',
                lineItemId,
              },
            ],
          },
        })
        .execute();

      return response.body;
    } catch (error) {
      this.logger.error('Error removing line item', error);
      throw new BadRequestException('Failed to remove line item from cart');
    }
  }

  async updateLineItemQuantity(cartId: string, updateDto: UpdateLineItemDto) {
    try {
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

      return response.body;
    } catch (error) {
      this.logger.error('Error updating line item quantity', error);
      throw new BadRequestException('Failed to update line item quantity');
    }
  }

  async applyDiscountCode(cartId: string, code: string, version: number) {
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
                action: 'addDiscountCode',
                code,
              },
            ],
          },
        })
        .execute();

      return response.body;
    } catch (error) {
      this.logger.error('Error applying discount code', error);
      throw new BadRequestException('Failed to apply discount code');
    }
  }
}