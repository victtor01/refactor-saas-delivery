import { BadGatewayException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { CreateStoreDto } from './dtos/create-store.dto';
import { ProxyService } from 'src/proxy/proxy.service';
import { _queueStores } from 'src/utils/queues';
import { Store } from './entities/store.entity';
import { Response } from 'express';
import { AuthService } from 'src/auth/auth.service';

type SelectStoreAndSetInResponseProps = {
  response: Response;
  storeId: string;
  managerId: string;
};

@Injectable()
export class StoresService {
  constructor(private readonly proxyService: ProxyService) {}

  private readonly logger: Logger = new Logger(StoresService.name);

  // async selectStore({
  //   storeId,
  //   response,
  //   managerId,
  // }: SelectStoreAndSetInResponseProps): Promise<Store> {
  //   try {
  //     const stores: Store[] = await this.findByManagerId(managerId);
  //     if (!stores[0]?.id) throw new BadGatewayException('Nenhuma loja disponível!');

  //     const selectedStore = stores?.filter((store: Store) => store.id === storeId)?.[0] || null;
  //     if (!selectedStore?.id) throw new BadGatewayException('Loja não encontrada!');

  //     const jwtStore: string = await this.authService.generateJwt();

  //     response.cookie('__access_token', {
  //       httpOnly: true,
  //       sameSite: 'strict',
  //       path: '/',
  //     });

  //     return selectedStore;
  //   } catch (error) {
  //     this.logger.error(error);
  //     throw new BadGatewayException(error.message);
  //   }
  // }

  async create(createStoreDto: CreateStoreDto, managerId: string): Promise<Store> {
    try {
      const created: Store = await this.proxyService.sendMessage<Store>({
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

  async findStores(page: number): Promise<Store[]> {
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

  async findByManagerId(managerId: string): Promise<Store[]> {
    try {
      const find: Store[] = await this.proxyService.sendMessage({
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
