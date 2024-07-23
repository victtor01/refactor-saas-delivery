import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { CreateClientDto } from '../interfaces/create-client.interface';
import { randomUUID } from 'crypto';

@Entity({ name: 'clients' })
export class Client {
  constructor(props: CreateClientDto, id?: string) {
    Object.assign(this, props);
    this.id = id || randomUUID();
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  firstName: string;

  @Column({ length: 100 })
  lastName: string;

  @Column({ length: 50, unique: true })
  email: string;

  @Column({ length: 64 })
  password: string;
}
