import { Module } from '@nestjs/common';
import { ProxyModule } from 'src/proxy/proxy.module';
import { StoresController } from './stores.controller';
import { StoresService } from './users-services';

@Module({
  imports: [ProxyModule],
  controllers: [StoresController],
  providers: [StoresService],
  exports: [StoresService],
})
export class StoresModule {}
