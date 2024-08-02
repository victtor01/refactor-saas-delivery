import { Product } from "src/products/entities/product.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { CreateCategoryDto } from "../dto/create-category.dto";
import { randomUUID } from "crypto";

@Entity({ name: 'categories' })
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToMany(() => Product, (product) => product.categories)
  products: Product[]

  @Column()
  storeId: string;

  @Column()
  managerId: string;

  constructor(props: CreateCategoryDto) {
    this.id = randomUUID();
    Object.assign(this, props);
  }
}
