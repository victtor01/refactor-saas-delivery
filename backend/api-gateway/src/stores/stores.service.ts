import { BadGatewayException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { CreateStoreDto } from './dtos/create-store.dto';
import { ProxyService } from 'src/proxy/proxy.service';
import { _queueStores } from 'src/utils/queues';
import { Response } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { UpdateStoreDto } from './dtos/update-store.dto';

type SelectStoreAndSetInResponseProps = {
  response: Response;
  storeId: string;
  managerId: string;
};

@Injectable()
export class StoresService {
  constructor(private readonly proxyService: ProxyService) {}

  private readonly logger: Logger = new Logger(StoresService.name);

  public async create(createStoreDto: CreateStoreDto, managerId: string) {
    try {
      const created = await this.proxyService.sendMessage({
        queue: 'stores',
        pattern: 'create-store',
        data: {
          ...createStoreDto,
          managerId,
        },
      });

      return created;
    } catch (error) {
      this.logger.error(error);
      throw new BadGatewayException(error.message);
    }
  }

  public async update(updateStoreDto: UpdateStoreDto, managerId: string) {
    try {
      const stores = await this.proxyService.sendMessage({
        data: { ...updateStoreDto, managerId },
        pattern: 'update',
        queue: 'stores',
      });

      return stores;
    } catch (error) {
      this.logger.error(error);
      throw new BadGatewayException(error.message);
    }
  }

  public async findStores(page: number) {
    try {
      const stores = await this.proxyService.sendMessage({
        queue: 'stores',
        pattern: 'find-all',
        data: { page },
      });

      return stores;
    } catch (error) {
      this.logger.error(error);
      throw new BadGatewayException(error.message);
    }
  }

  public async findByManagerId(managerId: string) {
    try {
      const find = await this.proxyService.sendMessage({
        queue: 'stores',
        pattern: 'find-by-managerId',
        data: { managerId },
      });

      return find;
    } catch (error) {
      throw new BadGatewayException(error.message);
    }
  }
}
