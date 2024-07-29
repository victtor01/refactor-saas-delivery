import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateClientDto } from './interfaces/create-client.interface';
import { Client } from './entities/client.entity';
import { ClientsRepository } from './repositories/clients-repository';
import { hash } from 'bcryptjs';

@Injectable()
export class ClientsService {
  constructor(private readonly clientsRepo: ClientsRepository) {}

  private saltsHashPassoword = 10;
  private logger: Logger = new Logger(ClientsService.name);

  public async findByEmail(email: string): Promise<Client> {
    try {
      const client = await this.clientsRepo.findByEmail(email);
      if (!client?.id) throw new NotFoundException('Usuário não existe!');

      return client;
    } catch (error) {
      this.logger.error(error.message);
      throw new BadRequestException(error.message);
    }
  }

  public async create(createClientDto: CreateClientDto): Promise<Client> {
    const clientToCreate = new Client(createClientDto);

    const clientInDatabaseExists = await this.clientsRepo.findByEmail(clientToCreate.email);
    if (clientInDatabaseExists?.id) {
      throw new BadRequestException('Usuário já existente!');
    }

    try {
      const { password } = clientToCreate;
      clientToCreate.password = await hash(password, this.saltsHashPassoword);
      const created = await this.clientsRepo.save(clientToCreate);

      return created;
    } catch (error) {
      const errorMessage = 'Houve um erro ao tentar criar cliente no banco de dados:';
      this.logger.error(errorMessage, error);

      throw new BadRequestException('Não foi possível criar um novo cliente!');
    }
  }
}
