import { IsNumber, IsOptional } from "class-validator";

export class FindStoresDto {
  @IsNumber()
  @IsOptional()
  page: number;
}