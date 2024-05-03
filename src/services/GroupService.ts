import { v4 } from 'uuid';
import { Group } from '../entities/Group';
import { Role } from '../entities/Role';
import { NotEditableItem } from '../exceptions/NotEditableItem';
import { GroupRepository } from '../repositories/GroupRepository';
import { GroupRoleRepository } from '../repositories/GroupRoleRepository';
import { RoleRepository } from '../repositories/RoleRepository';
import { TransactionRepository } from '../repositories/TransactionRepository';
import { UserGroupRepository } from '../repositories/UserRoleRepository';
import { SystemConstants } from '../systemConfig/SystemConstants';

export class GroupService {
  groupRepository: GroupRepository;
  roleRepository: RoleRepository;
  groupRoleRepository: GroupRoleRepository;
  userGroupRepository: UserGroupRepository;

  constructor(
    groupRepository: GroupRepository,
    roleRepository: RoleRepository,
    groupRoleRepository: GroupRoleRepository,
    userGroupRepository: UserGroupRepository
  ) {
    this.groupRepository = groupRepository;
    this.roleRepository = roleRepository;
    this.groupRoleRepository = groupRoleRepository;
    this.userGroupRepository = userGroupRepository;
  }

  private readonly systemGroups = SystemConstants.systemGroups;

  async findAll(): Promise<Group[]> {
    return await this.groupRepository.findAll();
  }

  async findById(id: string): Promise<Group> {
    const group: Group = await this.groupRepository.findById(id);
    group.roles = [];
    const roles: Role[] = await this.roleRepository.findRolesByGroupId(id);
    roles.forEach((role) => group.roles.push(role));
    return group;
  }

  async persist(group: Group): Promise<string | undefined> {
    if (this.canNotEditGroup(group)) {
      throw new NotEditableItem(`Unable to modify group ${group.name}`);
    }

    group.lastUpdate = new Date();

    await this.groupRoleRepository.destroy(group.id);

    const persistedGroup = await this.groupRepository.persist(group);

    if (persistedGroup) {
      await this.groupRoleRepository.persist(group.id, group.roles);
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
      await this.userGroupRepository.destroy(group.id);
      await this.groupRoleRepository.destroy(group.id);
      const result = await this.groupRepository.destroy(groupId);

      if (result) {
        return groupId;
      }
      return undefined;
    });
  }

  private canNotEditGroup(group: Group | null) {
    return group && group.name && this.systemGroups.indexOf(group.name) >= 0;
  }
}
