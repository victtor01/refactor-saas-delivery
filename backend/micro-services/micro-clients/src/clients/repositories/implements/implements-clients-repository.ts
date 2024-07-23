import { Client } from 'src/clients/entities/client.entity';
import { ClientsRepository } from '../clients-repository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ImplementsClientsRepository implements ClientsRepository {
  constructor(
    @InjectRepository(Client)
    private readonly clientsRepo: Repository<Client>,
  ) {}

  async save(client: Client): Promise<Client> {
    return await this.clientsRepo.save(client);
  }

  async findByEmail(email: string): Promise<Client> {
    return await this.clientsRepo.findOneBy({ email });
  }
}
