import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ProxyService } from 'src/proxy/proxy.service';
import { _queueProducts } from 'src/utils/queues';
import { CreateProductsCategoryDto } from './dto/create-products-category.dto';
import { UpdateProductsCategoryDto } from './dto/update-products-category.dto';

type CreateCategoryProps = {
  data: CreateProductsCategoryDto;
  storeId: string;
  managerId: string;
};

@Injectable()
export class ProductsCategoriesService {
  constructor(private readonly proxyService: ProxyService) {}

  private logger: Logger = new Logger(ProductsCategoriesService.name);

  public async create({
    storeId,
    managerId,
    data: createCategoryDto,
  }: CreateCategoryProps) {
    try {
      const { name } = createCategoryDto;
      const created = await this.proxyService.sendMessage({
        queue: _queueProducts,
        pattern: { cmd: 'categories', action: 'create' },
        data: {
          name,
          managerId,
          storeId,
        },
      });

      return created;
    } catch (error) {
      this.logger.error('Houve um erro ao tentar criar uma nova categoria!');
      throw new BadRequestException(error.message);
    }
  }

  public async findCategoriesByStore(storeId: string) {
    try {
      const categories = await this.proxyService.sendMessage({
        queue: _queueProducts,
        pattern: { cmd: 'categories', action: 'find-by-store' },
        data: { managerId: storeId },
      });

      return categories;
    } catch (error) {
      this.logger.error('Erro ao tentar buscar categorias', error);
      throw new BadRequestException(error.message);
    }
  }

  public async updateCategory(
    updateCategoryDto: UpdateProductsCategoryDto,
    managerId: string,
  ) {
    try {
      const { id, name } = updateCategoryDto;
      const categories = await this.proxyService.sendMessage({
        queue: _queueProducts,
        pattern: { cmd: 'categories', action: 'update' },
        data: {
          managerId,
          name,
          id,
        },
      });

      return categories;
    } catch (error) {
      this.logger.error('Erro ao tentar atualizar categoria!', error);
      throw new BadRequestException(error.message);
    }
  }
}
