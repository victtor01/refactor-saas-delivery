import { Body, Controller, Get, Param, Post, Put, Req } from '@nestjs/common';
import { Session, SessionStore } from 'src/auth/constants';
import { IsManager, IsRequiredStore } from 'src/utils/decorators';
import { CreateProductsCategoryDto } from './dto/create-products-category.dto';
import { ProductsCategoriesService } from './products-categories.service';
import { UpdateProductsCategoryDto } from './dto/update-products-category.dto';

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

  @Get('mine')
  @IsManager()
  @IsRequiredStore()
  findMyCategories(@Req() { store }: { store: Session }) {
    const { id: storeId } = store;
    return this.productsCategoriesService.findCategoriesByStore(storeId);
  }

  @Put(':categoryId')
  @IsManager()
  update(
    @Req() { manager }: { manager: Session },
    @Body() body: UpdateProductsCategoryDto,
    @Param('categoryId') categoryId: string,
  ) {
    const payload = { ...body, id: categoryId };
    return this.productsCategoriesService.updateCategory(payload, manager.id);
  }
}
