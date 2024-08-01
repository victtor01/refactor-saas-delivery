import { Controller } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
  RpcException,
} from '@nestjs/microservices';
import { ProxyService } from 'src/proxy/proxy.service';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@Controller()
export class CategoriesController {
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly proxyService: ProxyService,
  ) {}

  @MessagePattern({ cmd: 'categories', action: 'create' })
  public async create(
    @Payload() createCategoryDto: CreateCategoryDto,
    @Ctx() context: RmqContext,
  ) {
    try {
      const created = await this.categoriesService.create(createCategoryDto);
      this.proxyService.confirmMessage(context);

      return created;
    } catch (error) {
      this.proxyService.rejectMessage(context);
      throw new RpcException(error.message);
    }
  }

  @MessagePattern({ cmd: 'categories', action: 'find-by-store' })
  public async findByStoreId(
    @Payload() { storeId }: { storeId: string },
    @Ctx() context: RmqContext,
  ) {
    try {
      const created = await this.categoriesService.findByStoreId(storeId);
      this.proxyService.confirmMessage(context);

      return created;
    } catch (error) {
      this.proxyService.rejectMessage(context);
      throw new RpcException(error.message);
    }
  }
}
