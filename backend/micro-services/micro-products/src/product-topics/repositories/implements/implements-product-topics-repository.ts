import { ProductTopic } from "src/product-topics/entities/product-topic.entity";
import { ProductTopicsRepository } from "../product-topics-repository";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ImplementsProductsTopicsRepository implements ProductTopicsRepository {
  constructor(@InjectRepository(ProductTopic) private readonly productTopic: Repository<ProductTopic>) {}

  save(productTopic: ProductTopic): Promise<ProductTopic> {
    return this.productTopic.save(productTopic)
  }

  removeManyById(productTopicsIds: string[]): Promise<any> {
    return this.productTopic.delete(productTopicsIds)
  }
  
}