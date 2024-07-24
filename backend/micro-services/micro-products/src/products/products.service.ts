import {
  BadGatewayException,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductsRepository } from './repositories/products-repository';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(private readonly productsRepo: ProductsRepository) {}

  public async create({
    quantity = 0,
    ...props
  }: CreateProductDto): Promise<Product> {
    const { name, description, price, storeId, managerId } = props;
    if (!storeId || !managerId) {
      throw new BadRequestException('Faltando argumentos!');
    }

    try {
      const product = new Product({
        description,
        managerId,
        storeId,
        price,
        name,
      });

      const saved = await this.productsRepo.save({
        ...product,
      });

      return saved;
    } catch (error) {
      throw new BadRequestException('Não foi possível criar um novo usuário!');
    }
  }

  public async findByManagerAndStore(managerId: string, storeId: string) {
    const products = await this.productsRepo.findByManagerAndStore(managerId, storeId);

    return products;
  };

  public async findByManagerId(managerId: string): Promise<Product[]> {
    const products = await this.productsRepo.findByManagerId(managerId);

    return products;
  }
}
