import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ProductTopicsService } from './product-topics.service';
import { CreateProductTopicDto } from './dto/create-product-topic.dto';
import { UpdateProductTopicDto } from './dto/update-product-topic.dto';

@Controller()
export class ProductTopicsController {
  constructor(private readonly productTopicsService: ProductTopicsService) {}
}
