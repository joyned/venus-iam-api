import { mock, MockProxy } from "jest-mock-extended";
import { UserService } from "../../src/services/UserService";
import { UserRepository } from "../../src/repositories/UserRepository";
import { UserGroupRepository } from "../../src/repositories/UserRoleRepository";
import { User } from "../../src/entities/User";

describe("UserService", () => {
  let userService: UserService;
  let userRepositoryMock: MockProxy<UserRepository>;
  let userGroupRepositoryMock: MockProxy<UserGroupRepository>;

  beforeEach(() => {
    userRepositoryMock = mock<UserRepository>();
    userGroupRepositoryMock = mock<UserGroupRepository>();
    userService = new UserService(userRepositoryMock, userGroupRepositoryMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should persist user and return persisted user", async () => {
    const user: User = {
      id: "c4ab7f1a-0a5c-4672-9478-201db3bec07b",
      groups: [],
      name: "Testing",
      email: "test@email.com",
      password: "test",
      createdAt: new Date(),
      isBlocked: false,
    };
    userRepositoryMock.persist.mockResolvedValue(user);

    const result = await userService.persist(user);

    expect(userGroupRepositoryMock.destroy).toHaveBeenCalledWith(user.id);
    expect(userRepositoryMock.persist).toHaveBeenCalledWith(user);
    expect(userGroupRepositoryMock.persist).toHaveBeenCalledWith(
      user.id,
      user.groups,
    );
    expect(result).toEqual(user);
  });

  it("should return undefined when persisting user fails", async () => {
    const user: User = {
      id: "c4ab7f1a-0a5c-4672-9478-201db3bec07b",
      groups: [],
      name: "Testing",
      email: "test@email.com",
      password: "test",
      createdAt: new Date(),
      isBlocked: false,
    };
    userRepositoryMock.persist.mockResolvedValue(undefined);

    const result = await userService.persist(user);

    expect(userGroupRepositoryMock.destroy).toHaveBeenCalledWith(user.id);
    expect(userRepositoryMock.persist).toHaveBeenCalledWith(user);
    expect(userGroupRepositoryMock.persist).not.toHaveBeenCalled();
    expect(result).toBeUndefined();
  });
});
