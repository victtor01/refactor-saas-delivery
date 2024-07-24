import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreateProductDto } from 'src/products/dto/create-product.dto';
import { CreateStoreDto } from './create-store.dto';

export class UpdateStoreDto extends PartialType(CreateStoreDto) {
  @IsString({ message: 'campos incompletos!' })
  @IsNotEmpty({ message: 'Campos incompletos!' })
  id: string;
}
