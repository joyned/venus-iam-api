import { mock, MockProxy } from "jest-mock-extended";
import Jwt from "jsonwebtoken";
import { Role } from "../../src/entities/Role";
import { User } from "../../src/entities/User";
import { InvalidPasswordError } from "../../src/exceptions/InvalidPasswordError";
import { RoleRepository } from "../../src/repositories/RoleRepository";
import { UserRepository } from "../../src/repositories/UserRepository";
import { AuthenticationService } from "../../src/services/AuthenticationService";

describe("AuthenticationService", () => {
  let authenticationService: AuthenticationService;
  let userRepositoryMock: MockProxy<UserRepository>;
  let roleRepositoryMock: MockProxy<RoleRepository>;

  beforeEach(() => {
    userRepositoryMock = mock<UserRepository>();
    roleRepositoryMock = mock<RoleRepository>();
    authenticationService = new AuthenticationService(
      userRepositoryMock,
      roleRepositoryMock,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should login user", async () => {
    const user: User = {
      id: "1",
      name: "John Doe",
      email: "john.doe@example.com",
      password: "password",
      isBlocked: false,
      createdAt: new Date(),
      groups: [],
    };
    const roles: Role[] = [{ id: "1", name: "admin", createdAt: new Date() }];
    userRepositoryMock.findByEmail.mockResolvedValue(user);
    roleRepositoryMock.findRolesByUserId.mockResolvedValue(roles);

    const result = await authenticationService.login(user.email, user.password);

    expect(userRepositoryMock.findByEmail).toHaveBeenCalledWith(user.email);
    expect(roleRepositoryMock.findRolesByUserId).toHaveBeenCalledWith(user.id);
    expect(result).toHaveProperty("token");
    expect(result).toHaveProperty("user");
  });

  it("should throw InvalidPasswordError", async () => {
    const user: User = {
      id: "1",
      name: "John Doe",
      email: "john.doe@example.com",
      password: "password",
      isBlocked: false,
      createdAt: new Date(),
      groups: [],
    };
    userRepositoryMock.findByEmail.mockResolvedValue(user);

    await expect(
      authenticationService.login(user.email, "wrongpassword"),
    ).rejects.toThrow(
      new InvalidPasswordError(`Invalid password for user ${user.email}.`),
    );
  });

  it("should verify token", () => {
    const token = Jwt.sign({ foo: "bar" }, process.env.JWT_SECRET || "secret");

    const result = authenticationService.verifyToken(token);

    expect(result).toBe(true);
  });

  it("should not verify invalid token", () => {
    const result = authenticationService.verifyToken("invalidtoken");

    expect(result).toBe(false);
  });
});
