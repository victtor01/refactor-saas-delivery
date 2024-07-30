import { Body, Controller, Post, Req } from '@nestjs/common';
import { Session, SessionStore } from 'src/auth/constants';
import { IsManager, IsRequiredStore } from 'src/utils/decorators';
import { CreateProductsCategoryDto } from './dto/create-products-category.dto';
import { ProductsCategoriesService } from './products-categories.service';

@Controller('/products/categories')
export class ProductsCategoriesController {
  constructor(
    private readonly productsCategoriesService: ProductsCategoriesService,
  ) {}

  @Post()
  @IsManager()
  @IsRequiredStore()
  create(
    @Body() createProductsCategoryDto: CreateProductsCategoryDto,
    @Req() { manager, store }: { manager: Session; store: SessionStore },
  ) {
    return this.productsCategoriesService.create({
      data: createProductsCategoryDto,
      storeId: store.id,
      managerId: manager.id,
    });
  }
}
