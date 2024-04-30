import { v4 } from "uuid";
import { Client } from "../entities/Client";
import { ClientAllowedUrl } from "../entities/ClientAllowedUrl";
import { ClientAllowedUrlRepository } from "../repositories/ClientAllowedUrlRepository";
import { ClientRepository } from "../repositories/ClientRepository";
import { TransactionRepository } from "../repositories/TransactionRepository";

export class ClientService {

    async findAll(): Promise<Client[]> {
        return await ClientRepository.findAll();
    }

    async findById(id: string): Promise<Client> {
        const client: Client = await ClientRepository.findById(id);
        const allowedUrls: ClientAllowedUrl[] = await ClientAllowedUrlRepository.findByClientId(client.id);
        client.allowedUrls = []
        allowedUrls.forEach(url => client.allowedUrls.push(url.url));
        return client;
    }

    async persist(client: Client): Promise<string | undefined> {
        if (!client.id) {
            client.id = v4();
        }

        if (!client.createdAt) {
            client.createdAt = new Date();
        }

        if (!client.clientSecret) {
            client.clientSecret = v4();
        }

        await ClientAllowedUrlRepository.destroy(client.id);
        const createdClient = await ClientRepository.persist(client);

        if (createdClient) {
            await ClientAllowedUrlRepository.persist(client.id, client.allowedUrls);
            return createdClient.id;
        }
        return undefined;
    }

    async delete(id: string) {
        return await TransactionRepository.run(async () => {
            const result = await ClientRepository.destroy(id);
            if (result) {
                return id;
            }
            return undefined;
        });
    }
}