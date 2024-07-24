export class CreateProductDto {
  name: string;
  description: string;
  price: number;
  photo?: string;
  quantity: number;
  managerId: string;
  storeId: string;
}
