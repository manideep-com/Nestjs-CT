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
const cart_service_1 = require("./cart.service");
const create_cart_dto_1 = require("./dto/create-cart.dto");
const add_line_item_dto_1 = require("./dto/add-line-item.dto");
const update_line_item_dto_1 = require("./dto/update-line-item.dto");
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
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_cart_dto_1.CreateCartDto]),
    __metadata("design:returntype", void 0)
], CartController.prototype, "createCart", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CartController.prototype, "getCartById", null);
__decorate([
    (0, common_1.Post)(':id/line-items'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, add_line_item_dto_1.AddLineItemDto]),
    __metadata("design:returntype", void 0)
], CartController.prototype, "addLineItem", null);
__decorate([
    (0, common_1.Delete)(':id/line-items/:lineItemId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('lineItemId')),
    __param(2, (0, common_1.Query)('version')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number]),
    __metadata("design:returntype", void 0)
], CartController.prototype, "removeLineItem", null);
__decorate([
    (0, common_1.Patch)(':id/line-items'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_line_item_dto_1.UpdateLineItemDto]),
    __metadata("design:returntype", void 0)
], CartController.prototype, "updateLineItemQuantity", null);
__decorate([
    (0, common_1.Post)(':id/discount-codes'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CartController.prototype, "applyDiscountCode", null);
exports.CartController = CartController = __decorate([
    (0, common_1.Controller)('carts'),
    __metadata("design:paramtypes", [cart_service_1.CartService])
], CartController);
//# sourceMappingURL=cart.controller.js.map