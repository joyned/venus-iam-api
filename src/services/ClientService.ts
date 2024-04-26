import { v4 } from "uuid";
import { Client } from "../entities/Client";
import { ClientRepository } from "../repositories/ClientRepository";
import { ClientAllowedUrlRepository } from "../repositories/ClientAllowedUrlRepository";

export class ClientService {
    async findAll(): Promise<Client[]> {
        return await ClientRepository.find();
    }

    async findById(id: string): Promise<Client | null> {
        return await ClientRepository.findOneBy({ id: id });
    }

    async persist(client: Client): Promise<string | undefined> {
        if (!client.id) {
            client.id = v4();
        }

        if (!client.createdAt) {
            client.createdAt = new Date();
        }

        if (!client.clientId || !client.clientSecret) {
            client.clientId = v4();
            client.clientSecret = v4();
        }

        client.allowedUrls = client.allowedUrls?.map((au) => {
            au.client = client;
            return au;
        })

        const createdClient = await ClientRepository.save(client);

        if (client.allowedUrls) {
            await ClientAllowedUrlRepository.delete({ client: client });
            await ClientAllowedUrlRepository.save(client.allowedUrls);
        }
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