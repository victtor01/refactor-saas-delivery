import { Module } from '@nestjs/common';
import { ManagersService } from './managers.service';
import { ManagersController } from './managers.controller';
import { ProxyModule } from 'src/proxy/proxy.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [ProxyModule],
  controllers: [ManagersController],
  providers: [ManagersService],
  exports: [ManagersService]
})
export class ManagersModule {}
