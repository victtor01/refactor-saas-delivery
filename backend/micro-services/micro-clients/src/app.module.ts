import { Module } from '@nestjs/common';
import { ClientsModule } from './clients/clients.module';
import { ProxyModule } from './proxy/proxy.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ClientsModule,
    ProxyModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5435,
      username: 'admin',
      password: 'admin',
      database: 'micro_clients',
      entities: [__dirname + '/**/*.entity{.js,.ts}'],
      logging: false,
      synchronize: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
