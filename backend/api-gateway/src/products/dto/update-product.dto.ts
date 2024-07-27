import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { ProductTopic } from '../entities/product-topic.entity';
import { IsArray } from 'class-validator';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @IsArray()
  productTopics: ProductTopic[]
}
