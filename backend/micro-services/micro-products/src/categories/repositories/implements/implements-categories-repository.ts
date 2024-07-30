import { InjectRepository } from "@nestjs/typeorm";
import { CreateCategoryDto } from "src/categories/dto/create-category.dto";
import { Category } from "src/categories/entities/category.entity";
import { Repository } from "typeorm";
import { CategoriesRepository } from "../categories-repository";

export class ImplementsCategoriesRepository implements CategoriesRepository {
  constructor(
    @InjectRepository(Category)
    private readonly categoriesRepo: Repository<Category>
  ) {}

  public async save(category: CreateCategoryDto): Promise<Category> {
    const saved = await this.categoriesRepo.save(category);

    return saved
  }
}