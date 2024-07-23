import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateClientDto {
  @IsString({ message: 'O nome deve ser texto!' })
  @IsNotEmpty({ message: 'Campo Nome vazio!' })
  @MinLength(3, { message: 'Primeiro nome deve ter pelo menor 3 caracteres!' })
  firstName: string;

  @IsString({ message: 'O Sobrenome deve ser texto!' })
  @IsNotEmpty({ message: 'O campo Sobrenome não pode estar vazio!' })
  lastName: string;

  @IsEmail({}, { message: 'O email deve estar em um formato adequado!' })
  @IsNotEmpty({ message: 'Campo Email não pode estar vázio! ' })
  email: string;

  @IsString({ message: 'A senha deve ser texto!' })
  @IsNotEmpty({ message: 'Campo Senha não pode estar vázio!' })
  @MinLength(6, { message: 'A senha deve ter pelo menos 6 caracteres' })
  password: string;
}
