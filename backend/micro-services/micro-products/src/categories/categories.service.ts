import {
  BadGatewayException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from './entities/category.entity';
import { CategoriesRepository } from './repositories/categories-repository';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepo: CategoriesRepository) {}

  public async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const saved = await this.categoriesRepo.save(createCategoryDto);

    return saved;
  }

  public async findByStoreId(storeId: string): Promise<Category[]> {
    const stores = await this.categoriesRepo.findByStore(storeId);

    return stores;
  }

  public async findOneById(categoryId: string): Promise<Category> {
    const category = await this.categoriesRepo.findOneById(categoryId);

    return category;
  }

  public async updateCategory(updateCategoryDto: UpdateCategoryDto) {
    const categoryInDatabase = await this.findOneById(updateCategoryDto.id);

    if (!categoryInDatabase?.id) {
      throw new BadGatewayException('categoria não encontrada!');
    }

    if (categoryInDatabase?.managerId !== updateCategoryDto.managerId) {
      throw new UnauthorizedException(
        'usuário não tem permissão para atualizar esse item!',
      );
    }

    const updated = await this.categoriesRepo.update(updateCategoryDto);

    return updated;
  }
}
