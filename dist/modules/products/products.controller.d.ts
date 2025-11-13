import { ProductsService } from './products.service';
import { SearchProductsDto } from './dto/search-products.dto';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    searchProducts(searchDto: SearchProductsDto): Promise<{
        total: number | undefined;
        count: number;
        offset: number;
        results: import("@commercetools/platform-sdk").ProductProjection[];
    }>;
    getProductById(id: string): Promise<import("@commercetools/platform-sdk").Product>;
    getProductBySlug(slug: string, locale?: string): Promise<import("@commercetools/platform-sdk").Product>;
}
