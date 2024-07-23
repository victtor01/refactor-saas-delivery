import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CreateStoreInterface } from '../dto/create-store.dto';
import { randomUUID } from 'crypto';

@Entity({ name: 'stores' })
export class Store {
  constructor(props: CreateStoreInterface, id?: string) {
    Object.assign(this, props);
    this.id = id || randomUUID();
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  managerId: string;
}
