import { Injectable } from '@nestjs/common';
import { StoreRepository } from '../store-repository';
import { Store } from 'src/stores/entities/store.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

type FindAllWithLimit = {
  initial: number;
  limit: number;
};

@Injectable()
export class ImplementsStoreRepository implements StoreRepository {
  constructor(
    @InjectRepository(Store)
    private readonly storeRepo: Repository<Store>,
  ) {}

  public async save(store: { id: string; name: string }): Promise<Store> {
    return await this.storeRepo.save(store);
  }

  public async findByManagerId(managerId: string): Promise<Store[]> {
    return await this.storeRepo.findBy({ managerId });
  }

  public async findById(storeId: string): Promise<Store> {
    return await this.storeRepo.findOneBy({ id: storeId });
  }

  public async findAllLimit({
    initial,
    limit,
  }: FindAllWithLimit): Promise<Store[]> {
    return await this.storeRepo.find({
      skip: initial,
      take: limit,
    });
  }
}
