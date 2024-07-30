import { randomUUID } from 'crypto';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CreateClientDto } from '../interfaces/create-client.interface';

@Entity({ name: 'clients' })
export class Client {
  
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

  constructor(data?: CreateClientDto, id?: string) {
      Object.assign(this, data);
      this.id = id || randomUUID();
  }
}
