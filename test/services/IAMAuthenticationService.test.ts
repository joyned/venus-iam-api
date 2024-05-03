import { mock, MockProxy } from 'jest-mock-extended';
import { Role } from '../../src/entities/Role';
import { User } from '../../src/entities/User';
import { InvalidPasswordError } from '../../src/exceptions/InvalidPasswordError';
import { AuthSettingsRepository } from '../../src/repositories/AuthSettingsRepository';
import { RoleRepository } from '../../src/repositories/RoleRepository';
import { UserRepository } from '../../src/repositories/UserRepository';
import { IAMAuthenticationService } from '../../src/services/IAMAuthenticationService';

describe('IAMAuthenticationService', () => {
  let iamAuthenticationService: IAMAuthenticationService;
  let userRepositoryMock: MockProxy<UserRepository>;
  let roleRepositoryMock: MockProxy<RoleRepository>;
  let authSettingsRepositoryMock: MockProxy<AuthSettingsRepository>;

  beforeEach(() => {
    userRepositoryMock = mock<UserRepository>();
    roleRepositoryMock = mock<RoleRepository>();
    authSettingsRepositoryMock = mock<AuthSettingsRepository>();
    iamAuthenticationService = new IAMAuthenticationService(
      userRepositoryMock,
      roleRepositoryMock,
      authSettingsRepositoryMock
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return a token when login is successful', async () => {
    const user: User = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      password: 'password',
      isBlocked: false,
      createdAt: new Date(),
      groups: [],
    };
    const roles: Role[] = [{ id: '1', name: 'admin', createdAt: new Date() }];
    const authSettings = {
      jwt_secret: 'secret',
      token_durability: 3600,
      generate_refresh_token: false,
    };

    userRepositoryMock.findByEmail.mockResolvedValue(user);
    roleRepositoryMock.findRolesByUserId.mockResolvedValue(roles);
    authSettingsRepositoryMock.find.mockResolvedValue(authSettings);

    const result = await iamAuthenticationService.doLogin(
      user.email,
      user.password
    );

    expect(userRepositoryMock.findByEmail).toHaveBeenCalledWith(user.email);
    expect(roleRepositoryMock.findRolesByUserId).toHaveBeenCalledWith(user.id);
    expect(authSettingsRepositoryMock.find).toHaveBeenCalled();
    expect(result).toHaveProperty('token');
  });

  it('should throw an error when password is incorrect', async () => {
    const user: User = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      password: 'password',
      isBlocked: false,
      createdAt: new Date(),
      groups: [],
    };

    userRepositoryMock.findByEmail.mockResolvedValue(user);

    await expect(
      iamAuthenticationService.doLogin(user.email, 'wrongpassword')
    ).rejects.toThrow(
      new InvalidPasswordError(`Invalid e-mail or password for ${user.email}.`)
    );
  });

  it('should return roles when findRolesByUserId is called', async () => {
    const roles: Role[] = [
      { id: '1', name: 'admin', createdAt: new Date() },
      { id: '2', name: 'user', createdAt: new Date() },
    ];

    roleRepositoryMock.findRolesByUserId.mockResolvedValue(roles);

    const result = await iamAuthenticationService.findRolesByUserId('1');

    expect(roleRepositoryMock.findRolesByUserId).toHaveBeenCalledWith('1');
    expect(result).toEqual(roles.map((role) => role.name));
  });
});
