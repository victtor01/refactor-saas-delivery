import { Module } from '@nestjs/common';
import { ManagersController } from './managers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ManagerEntity } from './entities/manager.entity';
import { ManagersService } from './managers.service';
import { ManagersRepository } from './repositories/managers-repository';
import { ImplementsManagersRepository } from './repositories/implements/implements-managers-repository';
import { ProxyModule } from 'src/proxy/proxy.module';

@Module({
  imports: [TypeOrmModule.forFeature([ManagerEntity]), ProxyModule],
  controllers: [ManagersController],
  providers: [
    ManagersService,
    {
      provide: ManagersRepository,
      useClass: ImplementsManagersRepository,
    },
  ],
})
export class ManagersModule {}
