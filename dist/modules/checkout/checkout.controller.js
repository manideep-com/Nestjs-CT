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
const checkout_service_1 = require("./checkout.service");
const set_address_dto_1 = require("./dto/set-address.dto");
const create_order_dto_1 = require("./dto/create-order.dto");
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
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, set_address_dto_1.SetAddressDto]),
    __metadata("design:returntype", void 0)
], CheckoutController.prototype, "setShippingAddress", null);
__decorate([
    (0, common_1.Post)('carts/:id/billing-address'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, set_address_dto_1.SetAddressDto]),
    __metadata("design:returntype", void 0)
], CheckoutController.prototype, "setBillingAddress", null);
__decorate([
    (0, common_1.Post)('carts/:id/shipping-method'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CheckoutController.prototype, "setShippingMethod", null);
__decorate([
    (0, common_1.Post)('orders'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_order_dto_1.CreateOrderDto]),
    __metadata("design:returntype", void 0)
], CheckoutController.prototype, "createOrder", null);
__decorate([
    (0, common_1.Get)('orders/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CheckoutController.prototype, "getOrderById", null);
exports.CheckoutController = CheckoutController = __decorate([
    (0, common_1.Controller)('checkout'),
    __metadata("design:paramtypes", [checkout_service_1.CheckoutService])
], CheckoutController);
//# sourceMappingURL=checkout.controller.js.map