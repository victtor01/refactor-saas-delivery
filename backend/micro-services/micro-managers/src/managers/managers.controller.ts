import { Controller, Logger } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
  RpcException,
} from '@nestjs/microservices';
import { ManagersService } from './managers.service';
import { CreateManagerDto as CreateManagerDto } from './interfaces/create-manager.interface';
import { ProxyService } from 'src/proxy/proxy.service';

@Controller()
export class ManagersController {
  constructor(
    private readonly managersService: ManagersService,
    private readonly proxyService: ProxyService,
  ) {}

  private logger: Logger = new Logger(ManagersController.name);
  
  @MessagePattern('find-by-email')
  async findByEmail(
    @Payload('email') email: string,
    @Ctx() context: RmqContext,
  ) {
    try {
      const manager = await this.managersService.findOneByEmail(email);

      return manager;
    } catch (error) {
      this.logger.error('Error ao tentar criar Manager!', error);
      await this.proxyService.rejectMessage(context);

      throw new RpcException(error.message);
    }
  }

  @MessagePattern('create-manager')
  async create(
    @Payload() createManagerDto: CreateManagerDto,
    @Ctx() context: RmqContext,
  ) {
    try {
      const createdClient = await this.managersService.save(createManagerDto);
      await this.proxyService.confirmMessage(context);
      this.logger.log('Manager Criado com sucesso!');

      return createdClient;
    } catch (error) {
      this.logger.error('Error ao tentar criar Manager!', error);
      await this.proxyService.rejectMessage(context);

      throw new RpcException(error.message);
    }
  }
}
