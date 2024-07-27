import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { ProxyService } from 'src/proxy/proxy.service';
import { _queueClients, _queueProducts } from 'src/utils/queues';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly proxyService: ProxyService) {}

  public async create(
    createProductDto: CreateProductDto,
    storeId: string,
    managerId: string,
  ) {
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
  }

  public async update(
    updateProductDto: UpdateProductDto,
    productId: string,
    managerId: string,
  ) {
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
  }

  public async findProductByIdAndManager(productId: string, managerId: string) {
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
