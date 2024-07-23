import {
  Injectable,
} from '@nestjs/common';
import { CreateManagerDto } from './dto/create-manager.dto';
import { ProxyService } from 'src/proxy/proxy.service';
import { _queueManagers } from 'src/utils/queues';

@Injectable()
export class ManagersService {
  constructor(private readonly proxyService: ProxyService) {}

  async findOneByEmail(email: string) {
    const manager = await this.proxyService.sendMessage({
      queue: _queueManagers,
      pattern: 'find-by-email',
      data: { email },
    });

    return manager;
  }

  async create(createManagerDto: CreateManagerDto) {
    const created = await this.proxyService.sendMessage({
      pattern: 'create-manager',
      data: createManagerDto,
      queue: _queueManagers,
    });

    return created;
  }
}
