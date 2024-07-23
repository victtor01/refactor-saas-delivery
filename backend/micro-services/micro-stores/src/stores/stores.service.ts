import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateStoreInterface } from './dto/create-store.dto';
import { StoreRepository } from './repositories/store-repository';
import { Store } from './entities/store.entity';

@Injectable()
export class StoresService {
  constructor(private readonly storesRepo: StoreRepository) {}

  private limitPages = 2;

  async create({ name, managerId }: CreateStoreInterface) {
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

  async findByManagerId(managerId: string) {
    try {
      const stores: Store[] = await this.storesRepo.findByManagerId(managerId);

      return stores;
    } catch (error) {
      throw new BadRequestException(
        'Houve um erro ao tentar encontrar as lojas!',
      );
    }
  }

  async findWithLimit(page: number) {
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
