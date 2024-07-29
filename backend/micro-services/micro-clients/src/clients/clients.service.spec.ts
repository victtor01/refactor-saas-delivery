import { Test, TestingModule } from '@nestjs/testing';
import { ClientsService } from './clients.service';
import { ClientsRepository } from './repositories/clients-repository';
import { Client } from './entities/client.entity';
import { CreateClientDto } from './interfaces/create-client.interface';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { hash } from 'bcryptjs';

jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
}));

const createClientDto: CreateClientDto = {
  email: 'test@example.com',
  firstName: 'John',
  lastName: 'Doe',
  password: 'password123',
};

describe('ClientsService', () => {
  let service: ClientsService;
  let repo: ClientsRepository;

  const mockClientRepository = () => ({
    findByEmail: jest.fn(),
    save: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClientsService, { provide: ClientsRepository, useFactory: mockClientRepository }],
    }).compile();

    service = module.get<ClientsService>(ClientsService);
    repo = module.get<ClientsRepository>(ClientsRepository);
  });

  describe('findByEmail', () => {
    const email = 'test@example.com';
    it('should return a client if found', async () => {
      const client = new Client(createClientDto);

      repo.findByEmail = jest.fn().mockResolvedValue(client);

      expect(await service.findByEmail(email)).toEqual(client);
    });

    it('should throw NotFoundException if client is not found', async () => {
      repo.findByEmail = jest.fn().mockResolvedValue(null);

      await expect(service.findByEmail(email)).rejects.toThrow(BadRequestException);
    });
  });

  describe('create', () => {
    it('should create a new client', async () => {
      const client = new Client(createClientDto, 'uuid');
      repo.findByEmail = jest.fn().mockResolvedValue(null);
      repo.save = jest.fn().mockResolvedValue(client);

      (hash as jest.Mock).mockResolvedValue(Promise.resolve('hashedPassword'));

      const response = await service.create(createClientDto);

      expect(hash).toHaveBeenCalledTimes(1);
      expect(response).toBeInstanceOf(Client);
    });

    it('should throw BadRequestException if client already exists', async () => {
      const client = new Client(createClientDto, 'uuid');
      repo.findByEmail = jest.fn().mockResolvedValue(client);

      await expect(service.create(createClientDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if invalid properties', async () => {
      const createClientDto = {
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      } as CreateClientDto;

      (hash as jest.Mock).mockResolvedValue('hashedPassword');

      await expect(service.create(createClientDto)).rejects.toThrow(BadRequestException);
    });
  });
});
