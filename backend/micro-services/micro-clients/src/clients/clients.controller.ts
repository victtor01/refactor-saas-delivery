import { Controller, Logger } from '@nestjs/common';
import { Ctx, MessagePattern, Payload, RmqContext, RpcException } from '@nestjs/microservices';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './interfaces/create-client.interface';
import { ProxyService } from 'src/proxy/proxy.service';

@Controller()
export class ClientsController {
  constructor(
    private readonly clientsService: ClientsService,
    private readonly proxyService: ProxyService,
  ) {}

  private readonly logger: Logger = new Logger('ClientsController');

  @MessagePattern('find-by-email')
  async auth(@Payload('email') email: string, @Ctx() context: RmqContext) {
    try {
      const client = await this.clientsService.findByEmail(email);
      await this.proxyService.confirmMessage(context);

      return client;
    } catch (error) {
      this.proxyService.rejectMessage(context);
      this.logger.error('Houve um erro ao tentar efetuar login!', error);
      throw new RpcException(error.message);
    }
  }

  @MessagePattern('create-client')
  async create(@Payload() createClientDto: CreateClientDto, @Ctx() context: RmqContext) {
    try {
      this.logger.log('Criando um cliente...');
      const createdClient = await this.clientsService.create(createClientDto);
      await this.proxyService.confirmMessage(context);
      this.logger.log('Client Criado com sucesso!');

      return createdClient;
    } catch (error) {
      this.logger.error('Error ao tentar criar cliente!', error);
      await this.proxyService.rejectMessage(context);
      throw new RpcException(error.message);
    }
  }
}
