import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateStoreDto } from './dto/create-store.dto';
import { StoreRepository } from './repositories/store-repository';
import { Store } from './entities/store.entity';

@Injectable()
export class StoresService {
  constructor(private readonly storesRepo: StoreRepository) {}

  private limitPages = 2;

  public async create({ name, managerId }: CreateStoreDto) {
    const stores = await this.findByManagerId(managerId);

    if (stores?.length >= 5)
      throw new UnauthorizedException('A quantidade de lojas é 5');

    try {
      const storeToCreate: Store = new Store({ name, managerId });
      const created = await this.storesRepo.save(storeToCreate);

      return created;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  public async findByManagerId(managerId: string) {
    try {
      const stores: Store[] = await this.storesRepo.findByManagerId(managerId);

      return stores;
    } catch (error) {
      throw new BadRequestException(
        'Houve um erro ao tentar encontrar as lojas!',
      );
    }
  }

  public async update({ id, name, managerId }: Store) {
    if (!managerId) throw new BadRequestException('Parâmetros faltando!');

    const store = await this.findOneById(id);
    if (!store?.id || store?.managerId !== managerId) {
      throw new UnauthorizedException(
        'Você não pode atualizar oss dados dessa loja!',
      );
    }

    try {
      const store = new Store({ name, managerId }, id);
      const udpated: Store = await this.storesRepo.save(store);

      return udpated;
    } catch (error) {
      throw new BadRequestException(
        'Houve um erro ao tentar encontrar as lojas!',
      );
    }
  }

  public async findOneById(storeId: string): Promise<Store> {
    try {
      const store = await this.storesRepo.findById(storeId);

      return store;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  public async findWithLimit(page: number) {
    const initialPage = page === 1 ? page : (page - 1) * this.limitPages;

    try {
      const stores: Store[] = await this.storesRepo.findAllLimit({
        initial: initialPage,
        limit: this.limitPages,
      });

      return stores;
    } catch (error) {
      throw new BadRequestException(
        'Houve um erro ao tentar encontrar as lojas!',
      );
    }
  }
}
