import { ManagerEntity } from 'src/managers/entities/manager.entity';
import { ManagersRepository } from '../managers-repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

@Injectable()
export class ImplementsManagersRepository implements ManagersRepository {
  constructor(
    @InjectRepository(ManagerEntity)
    private readonly managerRepository: Repository<ManagerEntity>,
  ) {}

  async save(managerToCreate: ManagerEntity): Promise<ManagerEntity> {
    const manager = await this.managerRepository.save(managerToCreate);
  
    return manager;
  }

  async findOneByEmail(email: string): Promise<ManagerEntity> {
    const manager = await this.managerRepository.findOneBy({ email });

    return manager;
  }
}
