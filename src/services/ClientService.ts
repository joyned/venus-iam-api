import { Client } from "../entities/Client";
import { ClientRepository } from "../repositories/ClientRepository";

export class ClientService {
    async findAll(): Promise<Client[]> {
        return await ClientRepository.find();
    }

    async findById(id: string): Promise<Client | null> {
        return await ClientRepository.findOneBy({ id: id });
    }

    async persist(client: Client): Promise<string | undefined> {
        const createdClient = await ClientRepository.save(client);
        return createdClient.id;
    }

    async delete(id: string): Promise<string | undefined> {
        const { affected } = await ClientRepository.createQueryBuilder()
            .delete()
            .where("id = :id", { id: id })
            .execute();

        if (affected) {
            return id;
        }

        return undefined;
    }
}