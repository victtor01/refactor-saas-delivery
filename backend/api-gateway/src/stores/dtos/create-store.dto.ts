import { IsNotEmpty, IsString, Length } from "class-validator";

export class CreateStoreDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 25, { message: 'o Nome deve ter entre 3 e 25 caracteres' })
  name: string;
}