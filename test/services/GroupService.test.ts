import { mock, MockProxy } from 'jest-mock-extended';
import { Group } from '../../src/entities/Group';
import { Role } from '../../src/entities/Role';
import { NotEditableItem } from '../../src/exceptions/NotEditableItem';
import { GroupRepository } from '../../src/repositories/GroupRepository';
import { GroupRoleRepository } from '../../src/repositories/GroupRoleRepository';
import { RoleRepository } from '../../src/repositories/RoleRepository';
import { UserGroupRepository } from '../../src/repositories/UserRoleRepository';
import { GroupService } from '../../src/services/GroupService';
import { SystemConstants } from '../../src/systemConfig/SystemConstants';

describe('GroupService', () => {
  let groupService: GroupService;
  let groupRepositoryMock: MockProxy<GroupRepository>;
  let roleRepositoryMock: MockProxy<RoleRepository>;
  let groupRoleRepositoryMock: MockProxy<GroupRoleRepository>;
  let userGroupRepositoryMock: MockProxy<UserGroupRepository>;

  beforeEach(() => {
    groupRepositoryMock = mock<GroupRepository>();
    roleRepositoryMock = mock<RoleRepository>();
    groupRoleRepositoryMock = mock<GroupRoleRepository>();
    userGroupRepositoryMock = mock<UserGroupRepository>();
    groupService = new GroupService(
      groupRepositoryMock,
      roleRepositoryMock,
      groupRoleRepositoryMock,
      userGroupRepositoryMock
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should find all groups', async () => {
    const groups: Group[] = [
      {
        id: '1',
        name: 'admin',
        roles: [],
        lastUpdate: new Date(),
        createdAt: new Date(),
      },
    ];
    groupRepositoryMock.findAll.mockResolvedValue(groups);

    const result = await groupService.findAll();

    expect(groupRepositoryMock.findAll).toHaveBeenCalled();
    expect(result).toEqual(groups);
  });

  it('should find group by id', async () => {
    const group: Group = {
      id: '1',
      name: 'admin',
      roles: [],
      createdAt: new Date(),
      lastUpdate: new Date(),
    };
    const roles: Role[] = [{ id: '1', name: 'admin', createdAt: new Date() }];
    groupRepositoryMock.findById.mockResolvedValue(group);
    roleRepositoryMock.findRolesByGroupId.mockResolvedValue(roles);

    const result = await groupService.findById('1');

    expect(groupRepositoryMock.findById).toHaveBeenCalledWith('1');
    expect(roleRepositoryMock.findRolesByGroupId).toHaveBeenCalledWith('1');
    expect(result).toEqual({ ...group, roles });
  });

  it('should not edit system group', async () => {
    const group: Group = {
      id: '1',
      name: SystemConstants.systemGroups[0],
      roles: [],
      createdAt: new Date(),
      lastUpdate: new Date(),
    };
    const roles: Role[] = [{ id: '1', name: 'admin', createdAt: new Date() }];
    
    groupRepositoryMock.findById.mockResolvedValue(group);
    roleRepositoryMock.findRolesByGroupId.mockResolvedValue(roles);

    await expect(groupService.persist(group)).rejects.toThrow(
      new NotEditableItem(`Unable to modify group ${group.name}`)
    );
    await expect(groupService.delete(group.id)).rejects.toThrow(
      new NotEditableItem(`Unable to delete role ${group.name}`)
    );
  });
});
