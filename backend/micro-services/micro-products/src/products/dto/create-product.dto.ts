export class CreateProductDto {
  name: string;
  description: string;
  price: number;
  photo?: string;
  quantity: number;
  storeId: string;
  managerId: string;
}
