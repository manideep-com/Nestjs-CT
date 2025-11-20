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
exports.CheckoutController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const checkout_service_1 = require("./checkout.service");
const set_address_dto_1 = require("./dto/set-address.dto");
const create_order_dto_1 = require("./dto/create-order.dto");
const auth_guard_1 = require("../../common/auth/auth.guard");
let CheckoutController = class CheckoutController {
    constructor(checkoutService) {
        this.checkoutService = checkoutService;
    }
    setShippingAddress(id, addressDto) {
        return this.checkoutService.setShippingAddress(id, addressDto);
    }
    setBillingAddress(id, addressDto) {
        return this.checkoutService.setBillingAddress(id, addressDto);
    }
    getShippingMethods(id) {
        return this.checkoutService.getShippingMethods(id);
    }
    setShippingMethod(id, body) {
        return this.checkoutService.setShippingMethod(id, body.shippingMethodId, body.version);
    }
    createOrder(createOrderDto) {
        return this.checkoutService.createOrder(createOrderDto);
    }
    getOrderById(id) {
        return this.checkoutService.getOrderById(id);
    }
};
exports.CheckoutController = CheckoutController;
__decorate([
    (0, common_1.Post)('carts/:id/shipping-address'),
    (0, swagger_1.ApiOperation)({
        summary: 'Set shipping address',
        description: 'Set the shipping address for the cart before checkout'
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Cart ID', example: 'cart-123-abc' }),
    (0, swagger_1.ApiResponse)({
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
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid address data or version mismatch' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Cart not found' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, set_address_dto_1.SetAddressDto]),
    __metadata("design:returntype", void 0)
], CheckoutController.prototype, "setShippingAddress", null);
__decorate([
    (0, common_1.Post)('carts/:id/billing-address'),
    (0, swagger_1.ApiOperation)({
        summary: 'Set billing address',
        description: 'Set the billing address for payment processing'
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Cart ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Billing address set successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid address data' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Cart not found' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, set_address_dto_1.SetAddressDto]),
    __metadata("design:returntype", void 0)
], CheckoutController.prototype, "setBillingAddress", null);
__decorate([
    (0, common_1.Get)('carts/:id/shipping-methods'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get available shipping methods',
        description: 'Retrieve all shipping methods available for the cart based on shipping address and cart contents'
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Cart ID' }),
    (0, swagger_1.ApiResponse)({
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
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Cart not found' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CheckoutController.prototype, "getShippingMethods", null);
__decorate([
    (0, common_1.Post)('carts/:id/shipping-method'),
    (0, swagger_1.ApiOperation)({
        summary: 'Set shipping method',
        description: 'Select a shipping method for the cart'
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Cart ID' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                shippingMethodId: { type: 'string', example: 'shipping-method-123' },
                version: { type: 'number', example: 3 }
            },
            required: ['shippingMethodId', 'version']
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Shipping method set successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid shipping method or version' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Cart not found' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CheckoutController.prototype, "setShippingMethod", null);
__decorate([
    (0, common_1.Post)('orders'),
    (0, swagger_1.ApiOperation)({
        summary: 'Create order from cart',
        description: 'Convert the cart into an order. Cart must have shipping address and at least one line item.'
    }),
    (0, swagger_1.ApiResponse)({
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
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Cart validation failed (missing address or items)' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Cart not found' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_order_dto_1.CreateOrderDto]),
    __metadata("design:returntype", void 0)
], CheckoutController.prototype, "createOrder", null);
__decorate([
    (0, common_1.Get)('orders/:id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get order by ID',
        description: 'Retrieve complete order details including items, addresses, and status'
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Order ID', example: 'order-123-abc' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Order retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Order not found' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CheckoutController.prototype, "getOrderById", null);
exports.CheckoutController = CheckoutController = __decorate([
    (0, swagger_1.ApiTags)('Checkout'),
    (0, common_1.Controller)('checkout'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [checkout_service_1.CheckoutService])
], CheckoutController);
//# sourceMappingURL=checkout.controller.js.map