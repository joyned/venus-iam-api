import { mock, MockProxy } from 'jest-mock-extended';
import { RoleService } from '../../src/services/RoleService';
import { RoleRepository } from '../../src/repositories/RoleRepository';
import { GroupRoleRepository } from '../../src/repositories/GroupRoleRepository';

describe('RoleService', () => {
  let roleService: RoleService;
  let roleRepositoryMock: MockProxy<RoleRepository>;
  let groupRoleRepositoryMock: MockProxy<GroupRoleRepository>;

  beforeEach(() => {
    roleRepositoryMock = mock<RoleRepository>();
    groupRoleRepositoryMock = mock<GroupRoleRepository>();
    roleService = new RoleService(roleRepositoryMock, groupRoleRepositoryMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be created with the correct repository', () => {
    expect(roleService).toBeTruthy();
    expect(roleService).toBeInstanceOf(RoleService);
  });

});
