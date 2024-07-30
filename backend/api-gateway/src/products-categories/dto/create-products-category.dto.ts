import { IsString } from 'class-validator';

export class CreateProductsCategoryDto {
  @IsString({ message: 'O campo nome é obrigatório' })
  name: string;
}
