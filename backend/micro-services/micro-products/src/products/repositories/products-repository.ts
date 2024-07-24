import { Product } from '../entities/product.entity';

export abstract class ProductsRepository {
  abstract save(product: Product): Promise<Product>;
  abstract findByManagerId(managerId: string): Promise<Product[]>;
  abstract findByManagerAndStore(
    managerId: string,
    storeId: string,
  ): Promise<Product[]>;
}
