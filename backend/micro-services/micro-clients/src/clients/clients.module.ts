import { Module } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';
import { ProxyModule } from 'src/proxy/proxy.module';
import { ClientsRepository } from './repositories/clients-repository';
import { ImplementsClientsRepository } from './repositories/implements/implements-clients-repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';

@Module({
  imports: [ProxyModule, TypeOrmModule.forFeature([Client])],
  controllers: [ClientsController],
  providers: [
    ClientsService,
    {
      provide: ClientsRepository,
      useClass: ImplementsClientsRepository,
    },
  ],
})
export class ClientsModule {}
