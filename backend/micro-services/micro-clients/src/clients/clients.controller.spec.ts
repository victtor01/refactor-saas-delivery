import { Test, TestingModule } from '@nestjs/testing';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './interfaces/create-client.interface';
import { Client } from './entities/client.entity';
import { RmqContext } from '@nestjs/microservices';
import { ProxyService } from 'src/proxy/proxy.service';
import { RpcException } from '@nestjs/microservices';

const createClientDto: CreateClientDto = {
  email: 'example@gmail.com',
  firstName: 'example',
  lastName: 'example',
  password: 'example',
};

const client = new Client(createClientDto);

describe('ClientsController', () => {
  let controller: ClientsController;
  let clientsService: ClientsService;
  let proxyService: ProxyService;

  const mockClientsService = {
    findByEmail: jest.fn(),
    create: jest.fn(),
  };

  const mockProxyService = {
    confirmMessage: jest.fn(),
    rejectMessage: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientsController],
      providers: [
        { provide: ClientsService, useValue: mockClientsService },
        { provide: ProxyService, useValue: mockProxyService },
      ],
    }).compile();

    controller = module.get<ClientsController>(ClientsController);
    clientsService = module.get<ClientsService>(ClientsService);
    proxyService = module.get<ProxyService>(ProxyService);
  });

  describe('auth', () => {
    it('should return a client if found', async () => {
      const email = 'test@example.com';
      const context: RmqContext = {} as RmqContext;

      jest.spyOn(clientsService, 'findByEmail').mockResolvedValue(Promise.resolve(client));
      jest.spyOn(proxyService, 'confirmMessage').mockResolvedValue(undefined);

      const result = await controller.auth(email, context);

      expect(result).toEqual(client);
      expect(proxyService.confirmMessage).toHaveBeenCalledWith(context);
    });

    it('should throw RpcException if an error occurs', async () => {
      const email = 'test@example.com';
      const context: RmqContext = {} as RmqContext;
      const errorMessage = 'Client not found';

      jest.spyOn(clientsService, 'findByEmail').mockRejectedValue(new Error(errorMessage));
      jest.spyOn(proxyService, 'rejectMessage').mockResolvedValue(undefined);

      await expect(controller.auth(email, context)).rejects.toThrow(RpcException);
      expect(proxyService.rejectMessage).toHaveBeenCalledWith(context);
    });
  });

  describe('create', () => {
    it('should create and return a client', async () => {
      const createClientDto = { email: 'test@example.com', firstName: 'Test', lastName: 'User', password: 'password123' };
      const createdClient = { id: '1', ...createClientDto };
      const context: RmqContext = {} as RmqContext;

      jest.spyOn(clientsService, 'create').mockResolvedValue(createdClient);
      jest.spyOn(proxyService, 'confirmMessage').mockResolvedValue(undefined);

      const result = await controller.create(createClientDto, context);

      expect(result).toEqual(createdClient);
      expect(proxyService.confirmMessage).toHaveBeenCalledWith(context);
    });

    it('should throw RpcException if an error occurs during client creation', async () => {
      const createClientDto = { email: 'test@example.com', firstName: 'Test', lastName: 'User', password: 'password123' };
      const context: RmqContext = {} as RmqContext;
      const errorMessage = 'Error creating client';

      jest.spyOn(clientsService, 'create').mockRejectedValue(new Error(errorMessage));
      jest.spyOn(proxyService, 'rejectMessage').mockResolvedValue(undefined);

      await expect(controller.create(createClientDto, context)).rejects.toThrow(RpcException);
      expect(proxyService.rejectMessage).toHaveBeenCalledWith(context);
    });
  });
});