import { Module } from '@nestjs/common';
import { StoresService } from './stores.service';
import { StoresController } from './stores.controller';
import { StoreRepository } from './repositories/store-repository';
import { ImplementsStoreRepository } from './repositories/implements/implements-store-repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from './entities/store.entity';
import { ProxyModule } from 'src/proxy/proxy.module';

@Module({
  imports: [TypeOrmModule.forFeature([Store]), ProxyModule],
  controllers: [StoresController],
  providers: [
    StoresService,
    {
      provide: StoreRepository,
      useClass: ImplementsStoreRepository,
    },
  ],
})
export class StoresModule {}
