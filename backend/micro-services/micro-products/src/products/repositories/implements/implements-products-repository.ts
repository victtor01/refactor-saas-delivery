import { Injectable } from '@nestjs/common';
import { ProductsRepository } from '../products-repository';
import { Product } from 'src/products/entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ImplementsProductsRepository implements ProductsRepository {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  public async findByManagerAndStore(managerId: string, storeId: string): Promise<Product[]> {
    const products = await this.productRepository.find({
      where: { managerId, storeId },
    });

    return products;
  }

  public async save(product: Product): Promise<Product> {
    const saved = await this.productRepository.save(product);

    return saved;
  }

  public async findByManagerId(managerId: any): Promise<Product[]> {
    const products = await this.productRepository.find({
      where: { managerId },
    });

    return products;
  }
}
