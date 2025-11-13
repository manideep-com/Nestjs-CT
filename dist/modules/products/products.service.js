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
var ProductsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const commercetools_service_1 = require("../../common/commercetools/commercetools.service");
let ProductsService = ProductsService_1 = class ProductsService {
    constructor(ctService) {
        this.ctService = ctService;
        this.logger = new common_1.Logger(ProductsService_1.name);
    }
    async getProductById(id) {
        try {
            const response = await this.ctService
                .getApiRoot()
                .products()
                .withId({ ID: id })
                .get()
                .execute();
            return response.body;
        }
        catch (error) {
            this.logger.error(`Error fetching product by ID: ${id}`, error);
            throw new common_1.NotFoundException(`Product with ID ${id} not found`);
        }
    }
    async getProductBySlug(slug, locale = 'en') {
        try {
            const response = await this.ctService
                .getApiRoot()
                .products()
                .get({
                queryArgs: {
                    where: `masterData(current(slug(${locale}="${slug}")))`,
                },
            })
                .execute();
            if (response.body.results.length === 0) {
                throw new common_1.NotFoundException(`Product with slug ${slug} not found`);
            }
            return response.body.results[0];
        }
        catch (error) {
            this.logger.error(`Error fetching product by slug: ${slug}`, error);
            throw error;
        }
    }
    async searchProducts(searchDto) {
        try {
            const queryArgs = {
                limit: searchDto.limit,
                offset: searchDto.offset,
            };
            const filters = [];
            if (searchDto.search) {
                queryArgs['text.en'] = searchDto.search;
            }
            if (searchDto.category) {
                filters.push(`categories.id:"${searchDto.category}"`);
            }
            if (searchDto.minPrice !== undefined || searchDto.maxPrice !== undefined) {
                const min = searchDto.minPrice ?? 0;
                const max = searchDto.maxPrice ?? '*';
                filters.push(`variants.price.centAmount:range(${min} to ${max})`);
            }
            if (filters.length > 0) {
                queryArgs.filter = filters;
            }
            const response = await this.ctService
                .getApiRoot()
                .productProjections()
                .search()
                .get({ queryArgs })
                .execute();
            return {
                total: response.body.total,
                count: response.body.count,
                offset: response.body.offset,
                results: response.body.results,
            };
        }
        catch (error) {
            this.logger.error('Error searching products', error);
            throw error;
        }
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = ProductsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [commercetools_service_1.CommercetoolsService])
], ProductsService);
//# sourceMappingURL=products.service.js.map