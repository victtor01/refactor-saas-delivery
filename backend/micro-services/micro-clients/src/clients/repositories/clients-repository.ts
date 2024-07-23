import { Client } from "../entities/client.entity";

export abstract class ClientsRepository {
  abstract save(client: Client): Promise<Client>
  abstract findByEmail(email: string): Promise<Client>
}