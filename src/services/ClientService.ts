import { v4 } from "uuid";
import { Client } from "../entities/Client";
import { ClientAllowedUrl } from "../entities/ClientAllowedUrl";
import { InvalidClientIdError } from "../exceptions/InvalidClientIdError";
import { InvalidClientSecretError } from "../exceptions/InvalidClientSecretError";
import { InvalidRedirectUrlError } from "../exceptions/InvalidRedirectUrlError";
import { ClientAllowedUrlRepository } from "../repositories/ClientAllowedUrlRepository";
import ClientGroupRepository from "../repositories/ClientGroupRepository";
import { ClientRepository } from "../repositories/ClientRepository";
import { GroupRepository } from "../repositories/GroupRepository";
import { TransactionRepository } from "../repositories/TransactionRepository";

export class ClientService {
  clientRepository: ClientRepository;
  clientAllowedUrlRepository: ClientAllowedUrlRepository;
  clientGroupRepository: ClientGroupRepository;
  groupRepository: GroupRepository;

  constructor(
    clientRepository: ClientRepository,
    clientAllowedUrlRepository: ClientAllowedUrlRepository,
    clientGroupRepository: ClientGroupRepository,
    groupRepository: GroupRepository,
  ) {
    this.clientRepository = clientRepository;
    this.clientAllowedUrlRepository = clientAllowedUrlRepository;
    this.clientGroupRepository = clientGroupRepository;
    this.groupRepository = groupRepository;
  }

  async findAll(): Promise<Client[]> {
    return await this.clientRepository.findAll();
  }

  async findById(id: string): Promise<Client> {
    const client: Client = new Client(await this.clientRepository.findById(id));
    const allowedUrls: ClientAllowedUrl[] =
      await this.clientAllowedUrlRepository.findByClientId(client.id);
    const allowedGroups = await this.groupRepository.findGroupsByClientId(client.id);
    client.allowedUrls = [];
    client.allowedGroups = allowedGroups;
    allowedUrls.forEach((url) => client.allowedUrls.push(url.url));
    return client;
  }

  async persist(client: Client): Promise<string | undefined> {
    if (!client.clientSecret) {
      client.clientSecret = v4();
    }

    await this.clientAllowedUrlRepository.destroy(client.id);
    await this.clientGroupRepository.destroy(client.id);
    const createdClient = await this.clientRepository.persist(client);

    if (createdClient) {
      await this.clientAllowedUrlRepository.persist(
        client.id,
        client.allowedUrls,
      );
      await this.clientGroupRepository.persist(client.id, client.allowedGroups);

      return createdClient.id;
    }

    return undefined;
  }

  async delete(id: string) {
    return await TransactionRepository.run(async () => {
      const result = await this.clientRepository.destroy(id);
      if (result) {
        return id;
      }
      return undefined;
    });
  }

  async checkCredentials(
    clientId: string,
    clientSecret: string,
    redirectUrl: string,
  ): Promise<boolean> {
    const clientAllowedUrls =
      await this.clientAllowedUrlRepository.findByClientId(clientId);
    const client = new Client(await this.clientRepository.findById(clientId));

    const urls = clientAllowedUrls.map((au: any) => au.url);

    if (!client) {
      throw new InvalidClientIdError(`Client ${clientId} not found`);
    }

    if (client.clientSecret !== clientSecret) {
      throw new InvalidClientSecretError(
        `Invalid client secret for client ${clientId}`,
      );
    }

    if (!urls.includes(redirectUrl)) {
      throw new InvalidRedirectUrlError(
        `Redirect URL ${redirectUrl} is not allowed for client ${clientId}`,
      );
    }

    return true;
  }
}
