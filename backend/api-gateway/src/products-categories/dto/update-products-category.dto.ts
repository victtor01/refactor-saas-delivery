import { PartialType } from '@nestjs/mapped-types';
import { CreateProductsCategoryDto } from './create-products-category.dto';

export class UpdateProductsCategoryDto extends PartialType(CreateProductsCategoryDto) {}
