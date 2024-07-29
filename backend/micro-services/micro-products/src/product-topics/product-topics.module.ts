import { Module } from '@nestjs/common';
import { ProductTopicsService } from './product-topics.service';
import { ProductTopicsRepository } from './repositories/product-topics-repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductTopic } from './entities/product-topic.entity';
import { ImplementsProductsTopicsRepository } from './repositories/implements/implements-product-topics-repository';
import { TopicOptionsModule } from 'src/topic-options/topic-options.module';

@Module({
  imports: [TypeOrmModule.forFeature([ProductTopic]), TopicOptionsModule],
  controllers: [],
  providers: [
    ProductTopicsService,
    {
      provide: ProductTopicsRepository,
      useClass: ImplementsProductsTopicsRepository,
    },
  ],
  exports: [ProductTopicsService, ProductTopicsRepository],
})
export class ProductTopicsModule {}
