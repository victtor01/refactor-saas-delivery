import { randomUUID, UUID } from 'crypto';
import { Category } from 'src/categories/entities/category.entity';
import { ProductTopic } from 'src/product-topics/entities/product-topic.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'products' })
export class Product {
  constructor(props: Partial<Product>) {
    Object.assign(this, props);
    this.id = props?.id || randomUUID();
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ type: 'decimal', precision: 7, scale: 2 })
  price: number;

  @Column({ nullable: true })
  photo?: string;

  @Column({ type: 'int', default: 0 })
  quantity: number;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;

  @Column()
  storeId: string;

  @Column()
  managerId: string;

  @OneToMany(() => ProductTopic, (productTopic) => productTopic.product)
  productTopics?: ProductTopic[];

  @ManyToMany(() => Category, (category) => category.products)
  @JoinTable({ name: 'products_categories' })
  categories: Category[];
}
