import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { ProxyModule } from './proxy/proxy.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [ProductsModule, ProxyModule, 
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5435,
      username: 'admin',
      password: 'admin',
      database: 'micro_products',
      entities: [__dirname + '/**/*.entity{.js,.ts}'],
      logging: false,
      synchronize: true,
    }), CategoriesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
