import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { Session, SessionStore } from 'src/auth/constants';
import { IsManager, IsRequiredStore } from 'src/utils/decorators';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  private logger: Logger = new Logger(ProductsController.name);

  @Post()
  @IsManager()
  @IsRequiredStore()
  public async create(
    @Body() createProductDto: CreateProductDto,
    @Req() { store, manager }: { store: SessionStore; manager: Session },
  ) {
    return await this.productsService.create(
      createProductDto,
      store.id,
      manager.id,
    );
  }
  
  @Get('mine')
  @IsManager()
  @IsRequiredStore()
  public async getAllMyProducts(
    @Req() { manager, store }: { manager: Session; store: SessionStore },
  ) {
    return await this.productsService.findAllMyProductsByManagerAndStore(
      manager.id,
      store.id,
    );
  }

  @Get('/mine/:id')
  @IsManager()
  public async findMyProductById(
    @Param('id') id: string,
    @Req() { manager }: { manager: Session },
  ) {
    const { id: managerId } = manager;
    return await this.productsService.findProductByIdAndManager(id, managerId);
  }

  @Get("/mine/filter-category/:categoryId?")
  @IsManager()
  public async findByCategory(
    @Param('categoryId') categoryId: string,
    @Req() { manager }: { manager: Session }
  ) {
    
  }

  @Put(':productId')
  @IsManager()
  public async update(
    @Body() updateProductDto: UpdateProductDto,
    @Param('productId') productId: string,
    @Req() { manager }: { manager: Session },
  ) {
    return await this.productsService.update(
      updateProductDto,
      productId,
      manager.id,
    );
  }
}
