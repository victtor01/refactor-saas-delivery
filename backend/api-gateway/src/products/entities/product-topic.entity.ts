import { IsOptional, IsString } from "class-validator";
import { UUID } from "crypto";

export class ProductTopic {
  @IsString()
  @IsOptional()
  id?: UUID | string | null;

  @IsString()
  name: string;

  @IsString()
  productId: string;
}
