import { CommercetoolsService } from '../../common/commercetools/commercetools.service';
import { SearchProductsDto } from './dto/search-products.dto';
export declare class ProductsService {
    private readonly ctService;
    private readonly logger;
    constructor(ctService: CommercetoolsService);
    getProductById(id: string): Promise<import("@commercetools/platform-sdk").Product>;
    getProductBySlug(slug: string, locale?: string): Promise<import("@commercetools/platform-sdk").Product>;
    searchProducts(searchDto: SearchProductsDto): Promise<{
        total: number | undefined;
        count: number;
        offset: number;
        results: import("@commercetools/platform-sdk").ProductProjection[];
    }>;
}
