import { Client } from "../entities/Client";
import { ClientAllowedUrl } from "../entities/ClientAllowedUrl";

export class ClientService {

    async findAll(): Promise<Client[]> {
        return await Client.findAll({ include: { model: ClientAllowedUrl, as: 'clientAllowedUrls', attributes: ['url'] }, nest: true });
    }

    async findById(id: string): Promise<Client | null> {
        let client = await Client.findOne({ where: { id: id }, include: { model: ClientAllowedUrl, as: 'clientAllowedUrls', attributes: ['url'] } });
        client?.get({ plain: true })
        return client;
    }

    async persist(client: Client): Promise<unknown> {
        return client.get('id');
    }

    async delete(id: string) {
        const deleted = await Client.destroy({ where: { id: id } });
        console.log(this.delete);
        return deleted;
    }
}