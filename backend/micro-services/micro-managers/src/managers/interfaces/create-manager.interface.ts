import { IsString } from "class-validator";

export class CreateManagerDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
