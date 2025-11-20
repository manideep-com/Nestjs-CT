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
exports.ProductsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const products_service_1 = require("./products.service");
const search_products_dto_1 = require("./dto/search-products.dto");
const auth_guard_1 = require("../../common/auth/auth.guard");
let ProductsController = class ProductsController {
    constructor(productsService) {
        this.productsService = productsService;
    }
    searchProducts(searchDto) {
        return this.productsService.searchProducts(searchDto);
    }
    getProductById(id) {
        return this.productsService.getProductById(id);
    }
    getProductBySlug(slug, locale) {
        return this.productsService.getProductBySlug(slug, locale);
    }
};
exports.ProductsController = ProductsController;
__decorate([
    (0, common_1.Get)('search'),
    (0, swagger_1.ApiOperation)({
        summary: 'Search products',
        description: 'Search and filter products by various criteria including text search, category, and price range'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Products found successfully',
        schema: {
            example: {
                total: 100,
                count: 20,
                offset: 0,
                results: [
                    {
                        id: 'product-123',
                        name: { en: 'Sample Product' },
                        description: { en: 'Product description' },
                        masterVariant: {
                            id: 1,
                            prices: [{ value: { centAmount: 9999, currencyCode: 'USD' } }]
                        }
                    }
                ]
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [search_products_dto_1.SearchProductsDto]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "searchProducts", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get product by ID',
        description: 'Retrieve detailed information about a specific product using its ID'
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Product ID',
        example: 'product-123-abc'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Product found',
        schema: {
            example: {
                id: 'product-123',
                version: 1,
                masterData: {
                    current: {
                        name: { en: 'Sample Product' },
                        description: { en: 'Detailed description' },
                        categories: [],
                        masterVariant: {
                            id: 1,
                            sku: 'SKU-123',
                            prices: [{ value: { centAmount: 9999, currencyCode: 'USD' } }]
                        }
                    }
                }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Product not found' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "getProductById", null);
__decorate([
    (0, common_1.Get)('slug/:slug'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get product by slug',
        description: 'Retrieve product information using its URL-friendly slug identifier'
    }),
    (0, swagger_1.ApiParam)({
        name: 'slug',
        description: 'Product slug',
        example: 'sample-product'
    }),
    (0, swagger_1.ApiQuery)({
        name: 'locale',
        required: false,
        description: 'Language locale',
        example: 'en'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Product found' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Product not found' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('slug')),
    __param(1, (0, common_1.Query)('locale')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "getProductBySlug", null);
exports.ProductsController = ProductsController = __decorate([
    (0, swagger_1.ApiTags)('Products'),
    (0, common_1.Controller)('products'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [products_service_1.ProductsService])
], ProductsController);
//# sourceMappingURL=products.controller.js.map