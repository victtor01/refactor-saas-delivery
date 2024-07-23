import { ManagerEntity } from "src/managers/entities/manager.entity";
import { CreateManagerDto } from "../interfaces/create-manager.interface";

export abstract class ManagersRepository {
  abstract save(managerToCreate: ManagerEntity): Promise<ManagerEntity>
  abstract findOneByEmail(email: string): Promise<ManagerEntity>
}