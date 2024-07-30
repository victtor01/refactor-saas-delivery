import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ProxyService } from 'src/proxy/proxy.service';
import { _queueProducts } from 'src/utils/queues';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly proxyService: ProxyService) {}

  private logger: Logger = new Logger(ProductsService.name);

  public async create(
    createProductDto: CreateProductDto,
    storeId: string,
    managerId: string,
  ) {
    try {
      const { name, description, price, quantity } = createProductDto;
      const created = await this.proxyService.sendMessage({
        queue: 'products',
        pattern: { cmd: 'products', action: 'create' },
        data: {
          name,
          price,
          description,
          quantity,
          storeId,
          managerId,
        },
      });

      return created;
    } catch (error) {
      this.logger.debug('Erro ao tentar criar novo produto!', error);
      throw new BadRequestException('Erro ao tentar criar produto.');
    }
  }

  public async update(
    updateProductDto: UpdateProductDto,
    productId: string,
    managerId: string,
  ) {
    try {
      const productInformations = await this.findProductByIdAndManager(
        productId,
        managerId,
      );

      const updated = await this.proxyService.sendMessage({
        queue: _queueProducts,
        pattern: { cmd: 'products', action: 'update' },
        data: {
          ...productInformations,
          ...updateProductDto,
        },
      });

      return updated;
    } catch (error) {
      this.logger.debug('Erro ao tentar atulizar produto!', error);
      throw new BadRequestException('Erro ao tentar atualizar produto.');
    }
  }

  public async findProductByIdAndManager(productId: string, managerId: string) {
    try {
      const product = await this.proxyService.sendMessage({
        queue: _queueProducts,
        pattern: { cmd: 'products', action: 'find-by-id' },
        data: {
          productId,
        },
      });

      if (product.managerId !== managerId)
        throw new UnauthorizedException('Nenhum produto encontrado!');

      return product;
    } catch (error) {
      this.logger.debug("Erro ao tentar encontrar produto!", error);
      throw new BadRequestException("Erro ao tentar encontrar produto!")
    }
  }

  public async findAllByManagerId(managerId: string) {
    const products = await this.proxyService.sendMessage({
      queue: _queueProducts,
      pattern: { cmd: 'products', action: 'find-by-managerId' },
      data: {
        managerId,
      },
    });

    return products;
  }

  public async findAllMyProductsByManagerAndStore(
    managerId: string,
    storeId: string,
  ) {
    const products = await this.proxyService.sendMessage({
      queue: _queueProducts,
      pattern: { cmd: 'products', action: 'find-by-manager-and-store' },
      data: {
        managerId,
        storeId,
      },
    });

    return products;
  }
}
