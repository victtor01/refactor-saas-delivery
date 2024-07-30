import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ProxyService } from 'src/proxy/proxy.service';
import { _queueProducts } from 'src/utils/queues';
import { CreateProductsCategoryDto } from './dto/create-products-category.dto';

type CreateCategoryProps = {
  data: CreateProductsCategoryDto;
  storeId: string;
  managerId: string;
};

@Injectable()
export class ProductsCategoriesService {
  constructor(private readonly proxyService: ProxyService) {}

  private logger: Logger = new Logger(ProductsCategoriesService.name);

  public async create({ data: createCategoryDto, storeId, managerId }: CreateCategoryProps) {
    try {
      const created = await this.proxyService.sendMessage({
        queue: _queueProducts,
        pattern: { cmd: 'categories', action: 'create' },
        data: {
          name: createCategoryDto.name,
          storeId,
          managerId
        },
      });

      return created;
    } catch (error) {
      this.logger.error('Houve um erro ao tentar criar uma nova categoria!');
      throw new BadRequestException(error.message);
    }
  }
}
