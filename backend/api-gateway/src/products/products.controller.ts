import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { IsRequiredStore } from 'src/utils/decorators';
import { StorePayload } from 'src/auth/constants';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @IsRequiredStore()
  create(@Body() createProductDto: CreateProductDto, @Req() { store }: { store: StorePayload }) {
    return this.productsService.create(createProductDto);

  }
}
