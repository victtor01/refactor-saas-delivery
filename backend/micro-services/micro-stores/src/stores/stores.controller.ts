import { Controller, HttpException, Logger } from '@nestjs/common';
import { StoresService } from './stores.service';
import { CreateStoreInterface } from './dto/create-store.dto';
import { ProxyService } from 'src/proxy/proxy.service';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
  RpcException,
} from '@nestjs/microservices';
import { FindAllWithLimitDto } from './dto/find-store-with-limit.dto';

const errors = {
  queryError: 23502,
  badGateway: 502,
  Unauthorized: 401,
};

@Controller()
export class StoresController {
  constructor(
    private readonly storesService: StoresService,
    private readonly proxyService: ProxyService,
  ) {}

  private logger = new Logger(StoresController.name);

  private rejectMessage(context: RmqContext, error: any) {
    this.logger.error(error);
    Object.entries(errors).forEach(async ([_, key]) => {
      if (key === error.status) {
        this.proxyService.rejectMessage(context);
      }
    });
    throw new RpcException(error.message);
  }

  @MessagePattern('create-store')
  async create(
    @Payload() createStoreInterface: CreateStoreInterface,
    @Ctx() context: RmqContext,
  ) {
    try {
      const store = await this.storesService.create(createStoreInterface);
      await this.proxyService.confirmMessage(context);

      return store;
    } catch (error) {
      this.rejectMessage(context, error);
    }
  }

  @MessagePattern('find-by-managerId')
  async findByManagerId(
    @Ctx() context: RmqContext,
    @Payload('managerId') managerId: string,
  ) {
    try {
      const stores = await this.storesService.findByManagerId(managerId);

      return stores;
    } catch (error) {
      this.rejectMessage(context, error);
    }
  }

  @MessagePattern('find-all')
  async findByLimit(
    @Ctx() context: RmqContext,
    @Payload('page') page: number ,
  ) {
    try {
      const stores = await this.storesService.findWithLimit(page);

      return stores;
    } catch (error) {
      this.rejectMessage(context, error);
    }
  }
}
