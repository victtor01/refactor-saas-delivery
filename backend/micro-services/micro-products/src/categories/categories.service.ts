import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from './entities/category.entity';
import { CategoriesRepository } from './repositories/categories-repository';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepo: CategoriesRepository) {}

  public async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const saved = await this.categoriesRepo.save(createCategoryDto);

    return saved;
  }
}
