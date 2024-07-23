import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateManagerDto {
  @IsString({ message: 'Campo Nome obrigatório!' })
  @MinLength(3, { message: 'O mínimo de caracteres é 3' })
  firstName: string;
  @IsString({ message: 'Campo Sobrenome obrigatório!' })
  @MinLength(3, { message: 'O mínimo de caracteres é 3' })
  lastName: string;
  @IsEmail()
  @MinLength(3, { message: 'O mínimo de caracteres é 3' })
  email: string;
  @IsString({ message: 'Campo Senha obrigatório!' })
  @MinLength(6, { message: 'O mínimo de caracteres é 6' })
  password: string;
}
