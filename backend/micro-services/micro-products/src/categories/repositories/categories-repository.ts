import { CreateCategoryDto } from "../dto/create-category.dto";
import { UpdateCategoryDto } from "../dto/update-category.dto";
import { Category } from "../entities/category.entity";

export abstract class CategoriesRepository {
  abstract save(category: CreateCategoryDto): Promise<Category>
  abstract findOneById(categoryId: string): Promise<Category> 
  abstract findByStore(storeId: string): Promise<Category[]>
  abstract update(updateCategoryDto: UpdateCategoryDto): Promise<any>
}