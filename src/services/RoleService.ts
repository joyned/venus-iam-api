import { AppDataSource } from "../database";
import { Role } from "../entities/Role";
import { NotEditableItem } from "../exceptions/NotEditableItem";
import { RoleRepository } from "../repositories/RoleRepository";
import { SystemConstants } from "../systemConfig/SystemConstants";

export class RoleService {

    private readonly systemRoles = SystemConstants.systemRoles;

    async findAll(): Promise<Role[]> {
        return await RoleRepository.find();
    }

    async findById(id: string): Promise<Role | null> {
        return await RoleRepository.findOneBy({ id: id });
    }

    async persist(role: Role): Promise<string | undefined> {
        if (this.canNotEditRole(role)) {
            throw new NotEditableItem(`Unable to modify role ${role.name}`);
        }

        const persistedRole = await RoleRepository.save(role);
        return persistedRole.id;
    }

    async delete(roleId: string): Promise<string | undefined> {
        const role = await this.findById(roleId);

        if (this.canNotEditRole(role)) {
            throw new NotEditableItem(`Unable to delete role ${role?.name}`);
        }

        return await AppDataSource.manager.transaction(async (transactionalEntityManager) => {
            await transactionalEntityManager.query("DELETE FROM venus.group_roles WHERE role_id = $1", [roleId])
            const response = await transactionalEntityManager.getRepository(Role)
                .createQueryBuilder()
                .delete()
                .where("id = :id", { id: roleId })
                .execute();

            if (response.affected === 1) {
                return roleId;
            }

            return undefined;
        });
    }

    private canNotEditRole(role: Role | null) {
        return role && role.name && this.systemRoles.indexOf(role.name) >= 0
    }
}