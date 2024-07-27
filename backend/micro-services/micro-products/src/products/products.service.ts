import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductsRepository } from './repositories/products-repository';
import { Product } from './entities/product.entity';
import { ProductTopicsService } from 'src/product-topics/product-topics.service';

@Injectable()
export class ProductsService {
  constructor(
    private readonly productsRepo: ProductsRepository,
    private readonly productTopicsService: ProductTopicsService,
  ) {}

  private readonly logger: Logger = new Logger(ProductsService.name);

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

  public async findById(id: string) {
    try {
      const product = await this.productsRepo.findById(id);

      return product;
    } catch (error) {
      throw new BadGatewayException(error.message);
    }
  }

  public async findByManagerAndStore(managerId: string, storeId: string) {
    if (!managerId || !storeId)
      throw new BadGatewayException('parâmetros faltando!');

    try {
      const products = await this.productsRepo.findByManagerAndStore(
        managerId,
        storeId,
      );

      return products;
    } catch (error) {
      throw new BadGatewayException(
        'Houve um erro ao tentar carregar os produtos!',
      );
    }
  }

  public async update(product: Partial<Product>): Promise<Product> {
    try {
      const serializedProduct = new Product(product);
      const { productTopics, ...productProps } = serializedProduct;

      const productInDatabase = await this.productsRepo.findById(product.id);

      const [productSaved] = await Promise.all([
        this.productsRepo.save(productProps),
        this.productTopicsService.updateManyTopicsWithOptions(
          productTopics || [],
          productInDatabase,
        ),
      ]);

      return productSaved;
    } catch (error) {
      this.logger.error(error);
      throw new BadGatewayException(
        'Houve um erro ao tentar atualizar produto',
        error,
      );
    }
  }

  public async findByManagerId(managerId: string): Promise<Product[]> {
    const products = await this.productsRepo.findByManagerId(managerId);

    return products;
  }
}
