import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductsRepository } from './repositories/products-repository';
import { ImplementsProductsRepository } from './repositories/implements/implements-products-repository';
import { ProxyModule } from 'src/proxy/proxy.module';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), ProxyModule],
  controllers: [ProductsController],
  providers: [
    ProductsService,
    {
      provide: ProductsRepository,
      useClass: ImplementsProductsRepository,
    },
  ],
})
export class ProductsModule {}
