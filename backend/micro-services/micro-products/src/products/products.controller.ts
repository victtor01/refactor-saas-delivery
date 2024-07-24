import { Controller, ParseUUIDPipe } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
  RpcException,
} from '@nestjs/microservices';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ProxyService } from 'src/proxy/proxy.service';

@Controller()
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly proxyService: ProxyService,
  ) {}

  @MessagePattern({ cmd: 'products', action: 'create' })
  public async create(
    @Payload() payload: CreateProductDto,
    @Ctx() context: RmqContext,
  ) {
    const response = this.productsService.create(payload).catch((err) => {
      this.proxyService.rejectMessage(context);
      throw new RpcException(err);
    });

    return response;
  }

  @MessagePattern({ cmd: 'products', action: 'find-by-managerId' })
  public async findAllByManagerId(
    @Payload('managerId') managerId: string,
    @Ctx() context: RmqContext,
  ) {
    const response = this.productsService
      .findByManagerId(managerId)
      .catch((err: any) => {
        this.proxyService.rejectMessage(context);
        throw new RpcException(err);
      });

    return response;
  }

  @MessagePattern({ cmd: 'products', action: 'find-by-manager-and-store' })
  public async findAllByManagerAndStore(
    @Payload() payload: { managerId: string; storeId: string },
    @Ctx() context: RmqContext,
  ) {
    try {
      const { managerId, storeId } = payload;
      const response = await this.productsService.findByManagerAndStore(
        managerId,
        storeId,
      );

      return response;
    } catch (error) {
      this.proxyService.rejectMessage(context);
      throw new RpcException(error.message);
    }
  }
}
