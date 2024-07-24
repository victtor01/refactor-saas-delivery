import { FindAllWithLimitDto } from '../dto/find-store-with-limit.dto';
import { Store } from '../entities/store.entity';

export abstract class StoreRepository {
  abstract save(store: { id: string, name: string }): Promise<Store>;
  abstract findByManagerId(managerId: string): Promise<Store[]>;
  abstract findById(storeId: string): Promise<Store>
  abstract findAllLimit({ initial, limit }: FindAllWithLimitDto): Promise<Store[]>;
}
