import { Module } from '@nestjs/common';
import { ClientsModule } from './clients/clients.module';
import { ProxyModule } from './proxy/proxy.module';
import { AuthModule } from './auth/auth.module';
import { ManagersModule } from './managers/managers.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/auth.guard';
import { StoresModule } from './stores/stores.module';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [ClientsModule, ProxyModule, AuthModule, ManagersModule, StoresModule, ProductsModule],
  providers: [{
    provide: APP_GUARD,
    useClass: AuthGuard
  }],
  controllers: [],
})
export class AppModule {}
