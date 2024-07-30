import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProxyModule } from 'src/proxy/proxy.module';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { Category } from './entities/category.entity';
import { CategoriesRepository } from './repositories/categories-repository';
import { ImplementsCategoriesRepository } from './repositories/implements/implements-categories-repository';

@Module({
  imports: [TypeOrmModule.forFeature([Category]), ProxyModule],
  controllers: [CategoriesController],
  providers: [
    CategoriesService,
    {
      provide: CategoriesRepository,
      useClass: ImplementsCategoriesRepository,
    },
  ],
})
export class CategoriesModule {}
