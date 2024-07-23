import { Module } from '@nestjs/common';
import { ManagersModule } from './managers/managers.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProxyModule } from './proxy/proxy.module';

@Module({
  imports: [
    ManagersModule,
    ProxyModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5435,
      username: 'admin',
      password: 'admin',
      database: 'micro_managers',
      entities: [__dirname + '/**/*.entity{.js,.ts}'],
      logging: false,
      synchronize: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
