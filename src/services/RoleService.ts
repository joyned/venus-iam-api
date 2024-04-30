import { Role } from "../entities/Role";
import { NotEditableItem } from "../exceptions/NotEditableItem";
import { GroupRoleRepository } from "../repositories/GroupRoleRepository";
import { RoleRepository } from "../repositories/RoleRepository";
import { TransactionRepository } from "../repositories/TransactionRepository";
import { SystemConstants } from "../systemConfig/SystemConstants";

export class RoleService {

    private readonly systemRoles = SystemConstants.systemRoles;

    async findAll(): Promise<Role[]> {
        return await RoleRepository.findAll();
    }

    async findById(id: string): Promise<Role> {
        return await RoleRepository.findById(id);
    }

    async persist(role: Role): Promise<string | undefined> {
        if (this.canNotEditRole(role)) {
            throw new NotEditableItem(`Unable to modify role ${role.name}`);
        }

        const persistedRole = await RoleRepository.persist(role);
        return persistedRole?.id;
    }

    async delete(roleId: string): Promise<string | undefined> {
        const role = await this.findById(roleId);

        if (this.canNotEditRole(role)) {
            throw new NotEditableItem(`Unable to delete role ${role?.name}`);
        }

        return await TransactionRepository.run(async () => {
            await GroupRoleRepository.destroy(role.id);
            const result = await RoleRepository.destroy(roleId);

            if (result) {
                return roleId;
            }

            return undefined;
        });
    }

    private canNotEditRole(role: Role | null) {
        return role && role.name && this.systemRoles.indexOf(role.name) >= 0
    }
}