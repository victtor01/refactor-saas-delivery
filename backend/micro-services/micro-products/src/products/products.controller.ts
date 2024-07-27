import {
  BadGatewayException,
  Controller,
  Logger,
  ParseUUIDPipe,
  Req,
} from '@nestjs/common';
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
import { Product } from './entities/product.entity';

@Controller()
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly proxyService: ProxyService,
  ) {}

  private readonly logger: Logger = new Logger(ProductsController.name);

  @MessagePattern({ cmd: 'products', action: 'create' })
  public async create(
    @Payload() payload: CreateProductDto,
    @Ctx() context: RmqContext,
  ) {
    try {
      this.logger.debug('Criando novo produto...');
      const response = this.productsService.create(payload);
      this.proxyService.confirmMessage(context);

      return response;
    } catch (error) {
      this.proxyService.rejectMessage(context);
      this.logger.debug(error.message);
      throw new RpcException(error.message);
    }
  }

  @MessagePattern({ cmd: 'products', action: 'find-by-id' })
  public async findById(
    @Payload('productId') productId: string,
    @Ctx() context: RmqContext,
  ) {
    try {
      const response = this.productsService.findById(productId);
      this.proxyService.confirmMessage(context);

      return response;
    } catch (error) {
      this.proxyService.rejectMessage(context);
      this.logger.debug(error.message);
      throw new RpcException(error.message);
    }
  }

  @MessagePattern({ cmd: 'products', action: 'find-by-managerId' })
  public async findAllByManagerId(
    @Payload('managerId') managerId: string,
    @Ctx() context: RmqContext,
  ) {
    try {
      const response = this.productsService.findByManagerId(managerId);
      this.proxyService.confirmMessage(context);

      return response;
    } catch (error) {
      this.proxyService.rejectMessage(context);
      this.logger.debug(error.message);
      throw new RpcException(error.message);
    }
  }

  @MessagePattern({ cmd: 'products', action: 'update' })
  public async update(
    @Payload() product: Product,
    @Ctx() context: RmqContext,
  ) {
    try {
      const updated = await this.productsService.update(product);
      this.proxyService.confirmMessage(context);

      return updated;
    } catch (error) {
      this.proxyService.rejectMessage(context);
      this.logger.debug(error.message);
      throw new RpcException(error.message);
    }
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

      this.proxyService.confirmMessage(context);

      return response;
    } catch (error) {
      this.proxyService.rejectMessage(context);
      this.logger.debug(error.message);
      throw new RpcException(error.message);
    }
  }
}
