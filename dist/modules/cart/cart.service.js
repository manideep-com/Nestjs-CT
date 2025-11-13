"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var CartService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
const commercetools_service_1 = require("../../common/commercetools/commercetools.service");
let CartService = CartService_1 = class CartService {
    constructor(ctService) {
        this.ctService = ctService;
        this.logger = new common_1.Logger(CartService_1.name);
    }
    async createCart(createCartDto) {
        try {
            const cartDraft = {
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
        }
        catch (error) {
            this.logger.error('Error creating cart', error);
            throw error;
        }
    }
    async getCartById(id) {
        try {
            const response = await this.ctService
                .getApiRoot()
                .carts()
                .withId({ ID: id })
                .get()
                .execute();
            return response.body;
        }
        catch (error) {
            this.logger.error(`Error fetching cart: ${id}`, error);
            throw new common_1.NotFoundException(`Cart with ID ${id} not found`);
        }
    }
    async addLineItem(cartId, addLineItemDto) {
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
        }
        catch (error) {
            this.logger.error('Error adding line item', error);
            throw new common_1.BadRequestException('Failed to add line item to cart');
        }
    }
    async removeLineItem(cartId, lineItemId, version) {
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
        }
        catch (error) {
            this.logger.error('Error removing line item', error);
            throw new common_1.BadRequestException('Failed to remove line item from cart');
        }
    }
    async updateLineItemQuantity(cartId, updateDto) {
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
        }
        catch (error) {
            this.logger.error('Error updating line item quantity', error);
            throw new common_1.BadRequestException('Failed to update line item quantity');
        }
    }
    async applyDiscountCode(cartId, code, version) {
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
        }
        catch (error) {
            this.logger.error('Error applying discount code', error);
            throw new common_1.BadRequestException('Failed to apply discount code');
        }
    }
};
exports.CartService = CartService;
exports.CartService = CartService = CartService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [commercetools_service_1.CommercetoolsService])
], CartService);
//# sourceMappingURL=cart.service.js.map