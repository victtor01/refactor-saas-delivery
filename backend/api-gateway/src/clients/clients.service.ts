import {
  BadRequestException,
  HttpException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { ProxyService } from 'src/proxy/proxy.service';
import { catchError, lastValueFrom, timeout } from 'rxjs';
import { _queueClients } from '../utils/queues';
import { Client } from './entities/client.entity';

@Injectable()
export class ClientsService {
  constructor(private readonly proxyService: ProxyService) {}

  private logger: Logger = new Logger(ClientsService.name);
  private fiveSecounds = 1000 * 5;

  async findByEmail(email: string) {
    const client = await this.proxyService.sendMessage({
      queue: _queueClients,
      pattern: 'find-by-email',
      data: { email },
    });

    return client;
  }

  async create(createClientDto: CreateClientDto): Promise<Client> {
    const proxyClients = await this.proxyService.configureToQueue(_queueClients);

    const response = await lastValueFrom(
      proxyClients.send('create-client', createClientDto).pipe(
        timeout(this.fiveSecounds),
        catchError((err: HttpException) => {
          this.logger.error(err.message);
          throw new BadRequestException(err.message);
        }),
      ),
    );

    return response;
  }
}
