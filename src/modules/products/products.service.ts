import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { CommercetoolsService } from '../../common/commercetools/commercetools.service';
import { SearchProductsDto } from './dto/search-products.dto';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(private readonly ctService: CommercetoolsService) {}

  async getProductById(id: string) {
    try {
      const response = await this.ctService
        .getApiRoot()
        .products()
        .withId({ ID: id })
        .get()
        .execute();

      return response.body;
    } catch (error) {
      this.logger.error(`Error fetching product by ID: ${id}`, error);
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
  }

  async getProductBySlug(slug: string, locale: string = 'en') {
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
        throw new NotFoundException(`Product with slug ${slug} not found`);
      }

      return response.body.results[0];
    } catch (error) {
      this.logger.error(`Error fetching product by slug: ${slug}`, error);
      throw error;
    }
  }

  async searchProducts(searchDto: SearchProductsDto) {
    try {
      const queryArgs: any = {
        limit: searchDto.limit,
        offset: searchDto.offset,
      };

      const filters: string[] = [];

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
    } catch (error) {
      this.logger.error('Error searching products', error);
      throw error;
    }
  }
}