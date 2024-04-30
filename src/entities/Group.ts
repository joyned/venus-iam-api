import { Role } from './Role';

export class Group {
    declare id: string;
    declare name: string;
    declare createdAt: Date;
    declare lastUpdate: Date;
    declare roles: Role[];

    constructor(data?: any) {
        if (data) {
            this.id = data.id;
            this.name = data.name;
            this.createdAt = new Date(data.created_at);
            this.lastUpdate = new Date(data.last_update);
            this.roles = data.roles.map((roleData: any) => new Role(roleData));
        }
    }
}
