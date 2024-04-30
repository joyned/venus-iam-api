import { Client } from "./Client";
import { ClientAllowedUrl } from "./ClientAllowedUrl";
import { Group } from "./Group";
import { Role } from "./Role";
import { User } from "./User";

export const associations = () => {
    Client.hasMany(ClientAllowedUrl, { foreignKey: 'client_id', sourceKey: 'id', as: 'clientAllowedUrls' })
    ClientAllowedUrl.belongsTo(Client, { foreignKey: 'client_id', as: 'clients' });

    Group.belongsToMany(Role, { through: 'group_role', as: 'roles' })
    Role.belongsToMany(Group, { through: 'group_role' });

    User.belongsToMany(Group, { through: 'user_group', as: 'groups' })
    Group.belongsToMany(User, { through: 'user_group' });
}