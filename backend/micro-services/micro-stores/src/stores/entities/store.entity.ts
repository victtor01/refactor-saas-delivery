import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CreateStoreDto } from '../dto/create-store.dto';
import { randomUUID } from 'crypto';
import { Optional } from '@nestjs/common';

@Entity({ name: 'stores' })
export class Store {
  constructor(props: CreateStoreDto, id?: string) {
    Object.assign(this, props);
    this.id = id || randomUUID();
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  managerId: string;

  @Column({ nullable: true })
  description?: string;
}
