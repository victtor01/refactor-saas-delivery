import { Controller, Get, Post, Body, Req } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { IsClient, IsManager, IsRequiredStore } from 'src/utils/decorators';
import { Session, SessionStore } from 'src/auth/constants';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('mine')
  @IsManager()
  @IsRequiredStore()
  getAllMyProducts(@Req() { manager, store }: { manager: Session; store: SessionStore }) {
    return this.productsService.findAllMyProductsByManagerAndStore(manager.id, store.id);
  }

  @Post()
  @IsManager()
  @IsRequiredStore()
  create(
    @Body() createProductDto: CreateProductDto,
    @Req() { store, manager }: { store: SessionStore; manager: Session },
  ) {
    return this.productsService.create(createProductDto, store.id, manager.id);
  }
}
