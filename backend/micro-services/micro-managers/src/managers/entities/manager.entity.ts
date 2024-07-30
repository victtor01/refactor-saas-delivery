import { randomUUID } from 'crypto';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CreateManagerDto } from '../interfaces/create-manager.interface';

@Entity({ name: 'managers' })
export class ManagerEntity {

  constructor(props: CreateManagerDto, id?: string) {
    Object.assign(this, props);
    this.id = id || randomUUID();
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;
  
  @Column({ length: 100 })
  firstName: string;
  
  @Column({ length: 100 })
  lastName: string;
  
  @Column({ length: 100 })
  email: string;
  
  @Column({ length: 64 })
  password: string;
}
