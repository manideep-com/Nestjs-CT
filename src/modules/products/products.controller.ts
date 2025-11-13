import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { SearchProductsDto } from './dto/search-products.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('search')
  searchProducts(@Query() searchDto: SearchProductsDto) {
    return this.productsService.searchProducts(searchDto);
  }

  @Get(':id')
  getProductById(@Param('id') id: string) {
    return this.productsService.getProductById(id);
  }

  @Get('slug/:slug')
  getProductBySlug(
    @Param('slug') slug: string,
    @Query('locale') locale?: string,
  ) {
    return this.productsService.getProductBySlug(slug, locale);
  }
}