import { v4 } from "uuid";
import { Group } from "../entities/Group";
import { Role } from "../entities/Role";
import { NotEditableItem } from "../exceptions/NotEditableItem";
import { GroupRepository } from "../repositories/GroupRepository";
import { GroupRoleRepository } from "../repositories/GroupRoleRepository";
import { RoleRepository } from "../repositories/RoleRepository";
import { TransactionRepository } from "../repositories/TransactionRepository";
import { UserGroupRepository } from "../repositories/UserRoleRepository";
import { SystemConstants } from "../systemConfig/SystemConstants";

export class GroupService {

    private readonly systemGroups = SystemConstants.systemGroups;

    async findAll(): Promise<Group[]> {
        return await GroupRepository.findAll();
    }

    async findById(id: string): Promise<Group> {
        const group: Group = await GroupRepository.findById(id);
        group.roles = [];
        const roles: Role[] = await RoleRepository.findRolesByGroupId(id);
        roles.forEach(role => group.roles.push(role));
        return group;
    }

    async persist(group: Group): Promise<string | undefined> {
        let isCreate = false;
        if (this.canNotEditGroup(group)) {
            throw new NotEditableItem(`Unable to modify group ${group.name}`);
        }

        if (!group.id) {
            group.id = v4();
            isCreate = true;
        }

        if (!group.createdAt) {
            group.createdAt = new Date();
        }

        group.lastUpdate = new Date();

        await GroupRoleRepository.destroy(group.id);

        const persistedGroup = await GroupRepository.persist(group);

        if (persistedGroup) {
            await GroupRoleRepository.persist(group.id, group.roles);
            return persistedGroup.id;
        }
        return undefined;
    }

    async delete(groupId: string): Promise<string | undefined> {
        const group = await this.findById(groupId);

        if (this.canNotEditGroup(group)) {
            throw new NotEditableItem(`Unable to delete role ${group?.name}`);
        }

        return await TransactionRepository.run(async () => {
            await UserGroupRepository.destroy(group.id);
            await GroupRoleRepository.destroy(group.id);
            const result = await GroupRepository.destroy(groupId);

            if (result) {
                return groupId;
            }
            return undefined;
        });
    }

    private canNotEditGroup(group: Group | null) {
        return group && group.name && this.systemGroups.indexOf(group.name) >= 0
    }
}