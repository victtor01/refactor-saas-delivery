import { Module } from '@nestjs/common';
import { StoresController } from './stores.controller';
import { StoresService } from './stores.service';
import { ProxyModule } from 'src/proxy/proxy.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [ProxyModule],
  controllers: [StoresController],
  providers: [StoresService],
  exports: [StoresService],
})
export class StoresModule {}
