import { Module } from '@nestjs/common';
import { ProxyModule } from 'src/proxy/proxy.module';
import { ProductsCategoriesController } from './products-categories.controller';
import { ProductsCategoriesService } from './products-categories.service';

@Module({
  imports: [ProxyModule],
  controllers: [ProductsCategoriesController],
  providers: [ProductsCategoriesService],
})
export class ProductsCategoriesModule {}
