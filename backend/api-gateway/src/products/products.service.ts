import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { ProxyService } from 'src/proxy/proxy.service';
import { _queueClients, _queueProducts } from 'src/utils/queues';

@Injectable()
export class ProductsService {
  constructor(private readonly proxyService: ProxyService) {}

  public async create(createProductDto: CreateProductDto, storeId: string, managerId: string) {
    const { name, description, price, quantity } = createProductDto;

    return await this.proxyService.sendMessage({
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

  public async findAllMyProductsByManagerAndStore(managerId: string, storeId: string) {
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
