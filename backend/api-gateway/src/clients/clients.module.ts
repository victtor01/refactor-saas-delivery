import { Module } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';
import { ProxyModule } from 'src/proxy/proxy.module';
import { AuthModule } from 'src/auth/auth.module';
import { ManagersService } from 'src/managers/managers.service';

@Module({
  imports: [ProxyModule],
  controllers: [ClientsController],
  providers: [ClientsService],
  exports: [ClientsService]
})
export class ClientsModule {}
