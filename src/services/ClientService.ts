import { v4 } from "uuid";
import { Client } from "../entities/Client";
import { ClientRepository } from "../repositories/ClientRepository";
import { ClientAllowedUrl } from "../entities/ClientAllowedUrl";
import { ClientAllowedUrlRepository } from "../repositories/ClientAllowedUrlRepository";

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

        const createdClient = await ClientRepository.persist(client);

        if (createdClient) {
            return createdClient.id;
        }
        return undefined;
    }

    async delete(id: string) {
        const result = ClientRepository.destroy(id);
        console.log(result);
    }
}