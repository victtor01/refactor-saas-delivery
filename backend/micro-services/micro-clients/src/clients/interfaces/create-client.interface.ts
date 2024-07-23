import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateClientDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
