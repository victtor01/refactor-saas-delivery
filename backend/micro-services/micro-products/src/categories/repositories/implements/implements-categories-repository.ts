import { InjectRepository } from '@nestjs/typeorm';
import { CreateCategoryDto } from 'src/categories/dto/create-category.dto';
import { Category } from 'src/categories/entities/category.entity';
import { Repository } from 'typeorm';
import { CategoriesRepository } from '../categories-repository';
import { UpdateCategoryDto } from 'src/categories/dto/update-category.dto';

export class ImplementsCategoriesRepository implements CategoriesRepository {
  constructor(
    @InjectRepository(Category)
    private readonly categoriesRepo: Repository<Category>,
  ) {}

  public async save(category: CreateCategoryDto): Promise<Category> {
    const saved = await this.categoriesRepo.save(category);

    return saved;
  }

  public async findByStore(storeId: string): Promise<Category[]> {
    const categories = await this.categoriesRepo.findBy({ storeId });

    return categories;
  }

  public async findOneById(categoryId: string): Promise<Category> {
    const category = await this.categoriesRepo.findOneBy({
      id: categoryId,
    });

    return category;
  }

  public async update(updateCategoryDto: UpdateCategoryDto): Promise<any> {
    const { id, name } = updateCategoryDto;
    const updated = await this.categoriesRepo.update(id, {
      name,
    });

    return updated;
  }
}
