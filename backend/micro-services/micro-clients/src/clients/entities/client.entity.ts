import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { CreateClientDto } from '../interfaces/create-client.interface';
import { randomUUID } from 'crypto';
import { BadRequestException } from '@nestjs/common';

@Entity({ name: 'clients' })
export class Client {
  constructor({ firstName, lastName, email, password }: CreateClientDto, id?: string) {
    if (!firstName || !lastName || !email || !password) {
      throw new BadRequestException('parâmetros para criar um novo cliente inválidos!');
    }

    Object.assign(this, { firstName, lastName, email, password });
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
