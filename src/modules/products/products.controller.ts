import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { SearchProductsDto } from './dto/search-products.dto';
import { AuthGuard } from '../../common/auth/auth.guard';

@ApiTags('Products')
@Controller('products')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('search')
  @ApiOperation({ 
    summary: 'Search products',
    description: 'Search and filter products by various criteria including text search, category, and price range'
  })
  @ApiResponse({ 
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
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  searchProducts(@Query() searchDto: SearchProductsDto) {
    return this.productsService.searchProducts(searchDto);
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Get product by ID',
    description: 'Retrieve detailed information about a specific product using its ID'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Product ID',
    example: 'product-123-abc'
  })
  @ApiResponse({ 
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
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getProductById(@Param('id') id: string) {
    return this.productsService.getProductById(id);
  }

  @Get('slug/:slug')
  @ApiOperation({ 
    summary: 'Get product by slug',
    description: 'Retrieve product information using its URL-friendly slug identifier'
  })
  @ApiParam({ 
    name: 'slug', 
    description: 'Product slug',
    example: 'sample-product'
  })
  @ApiQuery({ 
    name: 'locale', 
    required: false, 
    description: 'Language locale',
    example: 'en'
  })
  @ApiResponse({ status: 200, description: 'Product found' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getProductBySlug(
    @Param('slug') slug: string,
    @Query('locale') locale?: string,
  ) {
    return this.productsService.getProductBySlug(slug, locale);
  }
}