import { RoleDTO } from "./RoleDTO";

export interface GroupDTO {
    id: string;
    name: string;
    createdAt: Date;
    lastUpdate: Date;
    roles: RoleDTO[];
}