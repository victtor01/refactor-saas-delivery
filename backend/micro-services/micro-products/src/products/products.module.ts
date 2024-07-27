import { forwardRef, Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductsRepository } from './repositories/products-repository';
import { ImplementsProductsRepository } from './repositories/implements/implements-products-repository';
import { ProxyModule } from 'src/proxy/proxy.module';
import { ProductTopicsModule } from 'src/product-topics/product-topics.module';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), ProxyModule, ProductTopicsModule],
  controllers: [ProductsController],
  providers: [
    ProductsService,
    {
      provide: ProductsRepository,
      useClass: ImplementsProductsRepository,
    },
  ],
  exports: [ProductsService, ProductsRepository],
})
export class ProductsModule {}
