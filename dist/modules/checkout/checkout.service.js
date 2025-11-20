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
var CheckoutService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckoutService = void 0;
const common_1 = require("@nestjs/common");
const commercetools_service_1 = require("../../common/commercetools/commercetools.service");
let CheckoutService = CheckoutService_1 = class CheckoutService {
    constructor(ctService) {
        this.ctService = ctService;
        this.logger = new common_1.Logger(CheckoutService_1.name);
    }
    async setShippingAddress(cartId, addressDto) {
        try {
            const cart = await this.getCart(cartId);
            this.logger.log(`Setting shipping address for cart: ${cartId}`);
            this.logger.log(`Current cart version: ${cart.version}`);
            this.logger.log(`Received version: ${addressDto.version}`);
            const address = {
                country: addressDto.country,
                city: addressDto.city,
                streetName: addressDto.streetName,
                postalCode: addressDto.postalCode,
            };
            if (addressDto.streetNumber)
                address.streetNumber = addressDto.streetNumber;
            if (addressDto.state)
                address.state = addressDto.state;
            if (addressDto.firstName)
                address.firstName = addressDto.firstName;
            if (addressDto.lastName)
                address.lastName = addressDto.lastName;
            if (addressDto.email)
                address.email = addressDto.email;
            if (addressDto.phone)
                address.phone = addressDto.phone;
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
        }
        catch (error) {
            this.logger.error('❌ Error setting shipping address');
            this.logger.error(`Cart ID: ${cartId}`);
            this.logger.error(`Status Code: ${error.statusCode}`);
            this.logger.error(`Error Body: ${JSON.stringify(error.body)}`);
            this.logger.error(`Error Message: ${error.message}`);
            const errorMessage = error.body?.message || error.message || 'Failed to set shipping address';
            throw new common_1.BadRequestException({
                statusCode: error.statusCode || 400,
                message: errorMessage,
                details: error.body || null,
            });
        }
    }
    async setBillingAddress(cartId, addressDto) {
        try {
            const cart = await this.getCart(cartId);
            this.logger.log(`Setting billing address for cart: ${cartId}`);
            this.logger.log(`Current cart version: ${cart.version}`);
            const address = {
                country: addressDto.country,
                city: addressDto.city,
                streetName: addressDto.streetName,
                postalCode: addressDto.postalCode,
            };
            if (addressDto.streetNumber)
                address.streetNumber = addressDto.streetNumber;
            if (addressDto.state)
                address.state = addressDto.state;
            if (addressDto.firstName)
                address.firstName = addressDto.firstName;
            if (addressDto.lastName)
                address.lastName = addressDto.lastName;
            if (addressDto.email)
                address.email = addressDto.email;
            if (addressDto.phone)
                address.phone = addressDto.phone;
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
        }
        catch (error) {
            this.logger.error('❌ Error setting billing address');
            this.logger.error(`Error: ${JSON.stringify(error.body || error.message)}`);
            const errorMessage = error.body?.message || error.message || 'Failed to set billing address';
            throw new common_1.BadRequestException({
                statusCode: error.statusCode || 400,
                message: errorMessage,
                details: error.body || null,
            });
        }
    }
    async setShippingMethod(cartId, shippingMethodId, version) {
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
        }
        catch (error) {
            this.logger.error('❌ Error setting shipping method');
            this.logger.error(`Error: ${JSON.stringify(error.body || error.message)}`);
            const errorMessage = error.body?.message || error.message || 'Failed to set shipping method';
            throw new common_1.BadRequestException({
                statusCode: error.statusCode || 400,
                message: errorMessage,
                details: error.body || null,
            });
        }
    }
    async createOrder(createOrderDto) {
        try {
            const cart = await this.getCart(createOrderDto.cartId);
            this.logger.log(`Creating order for cart: ${createOrderDto.cartId}`);
            this.logger.log(`Cart version: ${cart.version}`);
            if (!cart.shippingAddress) {
                throw new common_1.BadRequestException('Cart must have a shipping address before creating an order');
            }
            if (cart.lineItems.length === 0) {
                throw new common_1.BadRequestException('Cart must have at least one line item');
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
        }
        catch (error) {
            this.logger.error('❌ Error creating order');
            this.logger.error(`Cart ID: ${createOrderDto.cartId}`);
            this.logger.error(`Error: ${JSON.stringify(error.body || error.message)}`);
            const errorMessage = error.body?.message || error.message || 'Failed to create order';
            throw new common_1.BadRequestException({
                statusCode: error.statusCode || 400,
                message: errorMessage,
                details: error.body || null,
            });
        }
    }
    async getOrderById(orderId) {
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
        }
        catch (error) {
            this.logger.error(`❌ Error fetching order: ${orderId}`);
            this.logger.error(`Error: ${JSON.stringify(error.body || error.message)}`);
            throw new common_1.NotFoundException(`Order with ID ${orderId} not found`);
        }
    }
    async getShippingMethods(cartId) {
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
        }
        catch (error) {
            this.logger.error('❌ Error fetching shipping methods');
            this.logger.error(`Error: ${JSON.stringify(error.body || error.message)}`);
            const errorMessage = error.body?.message || error.message || 'Failed to fetch shipping methods';
            throw new common_1.BadRequestException(errorMessage);
        }
    }
    async getCart(cartId) {
        try {
            const response = await this.ctService
                .getApiRoot()
                .carts()
                .withId({ ID: cartId })
                .get()
                .execute();
            return response.body;
        }
        catch (error) {
            this.logger.error(`❌ Error fetching cart: ${cartId}`);
            throw new common_1.NotFoundException(`Cart with ID ${cartId} not found`);
        }
    }
};
exports.CheckoutService = CheckoutService;
exports.CheckoutService = CheckoutService = CheckoutService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [commercetools_service_1.CommercetoolsService])
], CheckoutService);
//# sourceMappingURL=checkout.service.js.map