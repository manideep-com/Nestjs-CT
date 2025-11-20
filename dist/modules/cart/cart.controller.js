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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const cart_service_1 = require("./cart.service");
const create_cart_dto_1 = require("./dto/create-cart.dto");
const add_line_item_dto_1 = require("./dto/add-line-item.dto");
const update_line_item_dto_1 = require("./dto/update-line-item.dto");
const auth_guard_1 = require("../../common/auth/auth.guard");
let CartController = class CartController {
    constructor(cartService) {
        this.cartService = cartService;
    }
    createCart(createCartDto) {
        return this.cartService.createCart(createCartDto);
    }
    getCartById(id) {
        return this.cartService.getCartById(id);
    }
    addLineItem(id, addLineItemDto) {
        return this.cartService.addLineItem(id, addLineItemDto);
    }
    removeLineItem(id, lineItemId, version) {
        return this.cartService.removeLineItem(id, lineItemId, version);
    }
    updateLineItemQuantity(id, updateDto) {
        return this.cartService.updateLineItemQuantity(id, updateDto);
    }
    applyDiscountCode(id, body) {
        return this.cartService.applyDiscountCode(id, body.code, body.version);
    }
};
exports.CartController = CartController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Create new cart',
        description: 'Create a new shopping cart for the user. Can be anonymous or associated with a customer.'
    }),
    (0, swagger_1.ApiResponse)({
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
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_cart_dto_1.CreateCartDto]),
    __metadata("design:returntype", void 0)
], CartController.prototype, "createCart", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get cart by ID',
        description: 'Retrieve cart details including line items, prices, and shipping information'
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Cart ID', example: 'cart-123-abc' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Cart retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Cart not found' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CartController.prototype, "getCartById", null);
__decorate([
    (0, common_1.Post)(':id/line-items'),
    (0, swagger_1.ApiOperation)({
        summary: 'Add item to cart',
        description: 'Add a product variant with specified quantity to the cart'
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Cart ID' }),
    (0, swagger_1.ApiResponse)({
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
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid product or cart version mismatch' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Cart not found' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, add_line_item_dto_1.AddLineItemDto]),
    __metadata("design:returntype", void 0)
], CartController.prototype, "addLineItem", null);
__decorate([
    (0, common_1.Delete)(':id/line-items/:lineItemId'),
    (0, swagger_1.ApiOperation)({
        summary: 'Remove item from cart',
        description: 'Remove a specific line item from the cart'
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Cart ID' }),
    (0, swagger_1.ApiParam)({ name: 'lineItemId', description: 'Line item ID to remove' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Item removed successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid version or line item' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Cart not found' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('lineItemId')),
    __param(2, (0, common_1.Query)('version')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number]),
    __metadata("design:returntype", void 0)
], CartController.prototype, "removeLineItem", null);
__decorate([
    (0, common_1.Patch)(':id/line-items'),
    (0, swagger_1.ApiOperation)({
        summary: 'Update line item quantity',
        description: 'Change the quantity of a specific line item in the cart'
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Cart ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Quantity updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid quantity or version' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Cart not found' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_line_item_dto_1.UpdateLineItemDto]),
    __metadata("design:returntype", void 0)
], CartController.prototype, "updateLineItemQuantity", null);
__decorate([
    (0, common_1.Post)(':id/discount-codes'),
    (0, swagger_1.ApiOperation)({
        summary: 'Apply discount code',
        description: 'Apply a promotional discount code to the cart'
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Cart ID' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                code: { type: 'string', example: 'SUMMER2024' },
                version: { type: 'number', example: 3 }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Discount code applied successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid discount code or version' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Cart not found' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CartController.prototype, "applyDiscountCode", null);
exports.CartController = CartController = __decorate([
    (0, swagger_1.ApiTags)('Cart'),
    (0, common_1.Controller)('carts'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [cart_service_1.CartService])
], CartController);
//# sourceMappingURL=cart.controller.js.map