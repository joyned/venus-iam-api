import { Client } from "./Client";
import { ClientAllowedUrl } from "./ClientAllowedUrl";

export const associations = () => {
    Client.hasMany(ClientAllowedUrl, { foreignKey: 'client_id', sourceKey: 'id', as: 'clientAllowedUrls' })
    ClientAllowedUrl.belongsTo(Client, { foreignKey: 'client_id', as: 'clients' });
}