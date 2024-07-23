import {
  BadRequestException,
  ConflictException,
  HttpException,
  Injectable,
} from '@nestjs/common';
import { ManagerEntity } from './entities/manager.entity';
import { ManagersRepository } from './repositories/managers-repository';
import { CreateManagerDto } from './interfaces/create-manager.interface';
import { hash } from 'bcryptjs';

@Injectable()
export class ManagersService {
  constructor(private readonly managerRepo: ManagersRepository) {}

  private hashPassword = (pass: string) => hash(pass, 10);

  async findOneByEmail(email: string): Promise<ManagerEntity> {
    try {
      const manager = await this.managerRepo.findOneByEmail(email);

      return manager;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async save(createManagerDto: CreateManagerDto): Promise<ManagerEntity> {
    const managerExists = await this.managerRepo.findOneByEmail(
      createManagerDto.email,
    );

    if (managerExists?.email === createManagerDto.email)
      throw new ConflictException('Usuário já existe');

    try {
      const managerToCreate = new ManagerEntity(createManagerDto);
      const { password } = managerToCreate;
      managerToCreate.password = await this.hashPassword(password);
      const created = await this.managerRepo.save(managerToCreate);

      return created;
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }
}
