import { v4 } from "uuid";
import { Client } from "../entities/Client";
import { ClientAllowedUrl } from "../entities/ClientAllowedUrl";
import { ClientAllowedUrlRepository } from "../repositories/ClientAllowedUrlRepository";
import { ClientRepository } from "../repositories/ClientRepository";
import { TransactionRepository } from "../repositories/TransactionRepository";
import { InvalidClientSecretError } from "../exceptions/InvalidClientSecretError";
import { InvalidClientIdError } from "../exceptions/InvalidClientIdError";
import { InvalidRedirectUrlError } from "../exceptions/InvalidRedirectUrlError";

export class ClientService {

    async findAll(): Promise<Client[]> {
        return await ClientRepository.findAll();
    }

    async findById(id: string): Promise<Client> {
        const client: Client = new Client(await ClientRepository.findById(id));
        const allowedUrls: ClientAllowedUrl[] = await ClientAllowedUrlRepository.findByClientId(client.id);
        client.allowedUrls = []
        allowedUrls.forEach(url => client.allowedUrls.push(url.url));
        return client;
    }

    async persist(client: Client): Promise<string | undefined> {
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

    async checkCredentials(clientId: string, clientSecret: string, redirectUrl: string): Promise<boolean> {
        const clientAllowedUrls = await ClientAllowedUrlRepository.findByClientId(clientId);
        const client = new Client(await ClientRepository.findById(clientId));

        const urls = clientAllowedUrls.map((au) => au.url);

        if(!client) {
            throw new InvalidClientIdError(`Client ${clientId} not found`);
        }
        
        if (client.clientSecret !== clientSecret) {
            throw new InvalidClientSecretError(`Invalid client secret for client ${clientId}`);
        }

        if(!urls.includes(redirectUrl)) {
            throw new InvalidRedirectUrlError(`Redirect URL ${redirectUrl} is not allowed for client ${clientId}`);
        }

        return true;
    }
}