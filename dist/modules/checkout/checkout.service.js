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
        }
        catch (error) {
            this.logger.error('Error setting shipping address', error);
            throw new common_1.BadRequestException('Failed to set shipping address');
        }
    }
    async setBillingAddress(cartId, addressDto) {
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
        }
        catch (error) {
            this.logger.error('Error setting billing address', error);
            throw new common_1.BadRequestException('Failed to set billing address');
        }
    }
    async setShippingMethod(cartId, shippingMethodId, version) {
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
        }
        catch (error) {
            this.logger.error('Error setting shipping method', error);
            throw new common_1.BadRequestException('Failed to set shipping method');
        }
    }
    async createOrder(createOrderDto) {
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
        }
        catch (error) {
            this.logger.error('Error creating order', error);
            throw new common_1.BadRequestException('Failed to create order');
        }
    }
    async getOrderById(orderId) {
        try {
            const response = await this.ctService
                .getApiRoot()
                .orders()
                .withId({ ID: orderId })
                .get()
                .execute();
            return response.body;
        }
        catch (error) {
            this.logger.error(`Error fetching order: ${orderId}`, error);
            throw new common_1.NotFoundException(`Order with ID ${orderId} not found`);
        }
    }
};
exports.CheckoutService = CheckoutService;
exports.CheckoutService = CheckoutService = CheckoutService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [commercetools_service_1.CommercetoolsService])
], CheckoutService);
//# sourceMappingURL=checkout.service.js.map