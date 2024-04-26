import { v4 } from "uuid";
import { AppDataSource } from "../database";
import { Group } from "../entities/Group";
import { DeletionError } from "../exceptions/DeletionError";
import { GroupRepository } from "../repositories/GroupRepository";
import { SystemConstants } from "../systemConfig/SystemConstants";
import { NotEditableItem } from "../exceptions/NotEditableItem";

export class GroupService {

    private readonly systemGroups = SystemConstants.systemGroups;

    async findAll(): Promise<Group[]> {
        return await GroupRepository.find();
    }

    async findById(id: string): Promise<Group | null> {
        return await GroupRepository.findOneBy({ id: id });
    }

    async persist(group: Group): Promise<string | undefined> {
        if (this.canNotEditGroup(group)) {
            throw new NotEditableItem(`Unable to modify group ${group.name}`);
        }

        if (!group.id) {
            group.id = v4();
        }

        if (!group.createdAt) {
            group.createdAt = new Date();
        }

        group.lastUpdate = new Date();

        const persistedGroup = await GroupRepository.save(group);
        return persistedGroup.id;
    }

    async delete(groupId: string): Promise<string | undefined> {
        const group = await this.findById(groupId);

        if (this.canNotEditGroup(group)) {
            throw new NotEditableItem(`Unable to delete role ${group?.name}`);
        }

        return await AppDataSource.manager.transaction(async (transactionalEntityManager) => {
            await transactionalEntityManager.query("DELETE FROM venus.user_groups WHERE group_id = $1", [groupId])
            await transactionalEntityManager.query("DELETE FROM venus.group_roles WHERE group_id = $1", [groupId])
            const response = await transactionalEntityManager.getRepository(Group)
                .createQueryBuilder()
                .delete()
                .where("id = :id", { id: groupId })
                .execute();

            if (response.affected === 1) {
                return groupId;
            }

            return undefined;
        })
    }

    private canNotEditGroup(group: Group | null) {
        return group && group.name && this.systemGroups.indexOf(group.name) >= 0
    }
}