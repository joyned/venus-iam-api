import { sequelize } from "../database";
import { Role } from "../entities/Role";
import { NotEditableItem } from "../exceptions/NotEditableItem";
import { SystemConstants } from "../systemConfig/SystemConstants";

export class RoleService {

    private readonly systemRoles = SystemConstants.systemRoles;

    async findAll(): Promise<Role[]> {
        return await Role.findAll();
    }

    async findById(id: string): Promise<Role | null> {
        return await Role.findOne({ where: { id: id } });
    }

    async persist(role: Role): Promise<string | undefined> {
        if (this.canNotEditRole(role)) {
            throw new NotEditableItem(`Unable to modify role ${role.name}`);
        }

        const persistedRole = await role.save();
        return persistedRole.id;
    }

    async delete(roleId: string): Promise<string | undefined> {
        const role = await this.findById(roleId);

        if (this.canNotEditRole(role)) {
            throw new NotEditableItem(`Unable to delete role ${role?.name}`);
        }

        return await sequelize.transaction(async t => {
            sequelize.query('DELETE FROM venus.group_roles WHERE role_id = ?', {
                replacements: [roleId],
                transaction: t
            });

            const r = await Role.destroy({ where: { id: roleId } });

            if (r) {
                return roleId;
            }

            return undefined;
        })
    }

    private canNotEditRole(role: Role | null) {
        return role && role.name && this.systemRoles.indexOf(role.name) >= 0
    }
}