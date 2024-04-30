import { v4 } from "uuid";
import { Group } from "../entities/Group";
import { NotEditableItem } from "../exceptions/NotEditableItem";
import { SystemConstants } from "../systemConfig/SystemConstants";
import { sequelize } from "../database";
import { Role } from "../entities/Role";

export class GroupService {

    private readonly systemGroups = SystemConstants.systemGroups;

    async findAll(): Promise<Group[]> {
        return await Group.findAll({ include: { association: 'roles' } });
    }

    async findById(id: string): Promise<Group | null> {
        return await Group.findOne({ where: { id: id }, include: { association: 'roles' } });
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

        const persistedGroup = await group.save();
        return persistedGroup.id;
    }

    async delete(groupId: string): Promise<string | undefined> {
        const group = await this.findById(groupId);

        if (this.canNotEditGroup(group)) {
            throw new NotEditableItem(`Unable to delete role ${group?.name}`);
        }

        return await sequelize.transaction(async t => {
            sequelize.query('DELETE FROM venus.user_groups WHERE group_id = ?', {
                replacements: [groupId],
                transaction: t
            });

            sequelize.query('DELETE FROM venus.group_roles WHERE group_id = ?', {
                replacements: [groupId],
                transaction: t
            });

            const r = await Group.destroy({ where: { id: groupId } });

            if (r) {
                return groupId;
            }

            return undefined;
        });
    }

    private canNotEditGroup(group: Group | null) {
        return group && group.name && this.systemGroups.indexOf(group.name) >= 0
    }
}