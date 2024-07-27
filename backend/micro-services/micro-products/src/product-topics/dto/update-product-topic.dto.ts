import { PartialType } from '@nestjs/mapped-types';
import { CreateProductTopicDto } from './create-product-topic.dto';

export class UpdateProductTopicDto extends PartialType(CreateProductTopicDto) {
  id: number;
}
