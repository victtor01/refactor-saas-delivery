import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthDto {
  @IsEmail({}, { message: 'Formato de Email inválido!' })
  @IsNotEmpty({ message: `Campo 'email' obrigatório` })
  email: string;

  @IsString({ message: 'Formato da senha inválido!' })
  @IsNotEmpty({ message: `Campo 'senha' obrigatório` })
  password: string;
}
