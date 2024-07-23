import { Module } from '@nestjs/common';
import { StoresModule } from './stores/stores.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProxyModule } from './proxy/proxy.module';

@Module({
  imports: [
    StoresModule,
    ProxyModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5435,
      username: 'admin',
      password: 'admin',
      database: 'micro_stores',
      entities: [__dirname + '/**/*.entity{.js,.ts}'],
      synchronize: true,
      logging: false,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
