import { Controller } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
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
  async create(
    @Payload() createCategoryDto: CreateCategoryDto,
    @Ctx() context: RmqContext,
  ) {
    try {
      const created = await this.categoriesService.create(createCategoryDto);
      this.proxyService.confirmMessage(context);
      
      return created;
    } catch (error) {
      this.proxyService.rejectMessage(context);
    }
  }
}
