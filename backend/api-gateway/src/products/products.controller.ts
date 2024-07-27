import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  Logger,
  Param,
  BadGatewayException,
  Put,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { IsClient, IsManager, IsRequiredStore } from 'src/utils/decorators';
import { Session, SessionStore } from 'src/auth/constants';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  private logger: Logger = new Logger(ProductsController.name);

  @Get('mine')
  @IsManager()
  @IsRequiredStore()
  public async getAllMyProducts(
    @Req() { manager, store }: { manager: Session; store: SessionStore },
  ) {
    try {
      const products =
        await this.productsService.findAllMyProductsByManagerAndStore(
          manager.id,
          store.id,
        );

      return products;
    } catch (error) {
      this.logger.error('erro ao pegar produtos do manager!');
      throw new BadGatewayException(error.message);
    }
  }

  @Get('/mine/:id')
  @IsManager()
  public async findMyProductById(
    @Param('id') id: string,
    @Req() { manager }: { manager: Session },
  ) {
    try {
      const product = await this.productsService.findProductByIdAndManager(
        id,
        manager.id,
      );

      return product;
    } catch (error) {
      throw new BadGatewayException(error.message);
    }
  }

  @Post()
  @IsManager()
  @IsRequiredStore()
  public async create(
    @Body() createProductDto: CreateProductDto,
    @Req() { store, manager }: { store: SessionStore; manager: Session },
  ) {
    try {
      const products = this.productsService.create(
        createProductDto,
        store.id,
        manager.id,
      );
      return products;
    } catch (error) {
      throw new BadGatewayException(error.message);
    }
  }

  @Put(':productId')
  @IsManager()
  public async update(
    @Body() updateProductDto: UpdateProductDto,
    @Param('productId') productId: string,
    @Req() { manager }: { manager: Session },
  ) {
    const updated = await this.productsService.update(
      updateProductDto,
      productId,
      manager.id,
    );

    return updated;
  }
}
