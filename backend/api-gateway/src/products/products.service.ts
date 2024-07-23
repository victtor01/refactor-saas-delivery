import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProxyService } from 'src/proxy/proxy.service';

@Injectable()
export class ProductsService {
  constructor(private readonly proxyService: ProxyService) {}

  async create(createProductDto: CreateProductDto) {
   
    console.log(createProductDto)
    // return await this.proxyService.sendMessage({
    //   queue: 'products',
    //   action: { cmd: 'products', action: 'create' },
    //   data: createProductDto,
    // });
  }
}
