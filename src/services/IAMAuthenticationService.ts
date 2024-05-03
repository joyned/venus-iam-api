import Jwt from "jsonwebtoken";
import { Role } from "../entities/Role";
import { AuthSettingsRepository } from "../repositories/AuthSettingsRepository";
import { RoleRepository } from "../repositories/RoleRepository";
import { UserRepository } from "../repositories/UserRepository";
import { AuthSettings } from "../entities/AuthSettings";
import { InvalidPasswordError } from "../exceptions/InvalidPasswordError";

export class IAMAuthenticationService {
  userRepository: UserRepository;
  roleRepository: RoleRepository;
  authSettingsRepository: AuthSettingsRepository;

  constructor(
    userRepository: UserRepository,
    roleRepository: RoleRepository,
    authSettingsRepository: AuthSettingsRepository,
  ) {
    this.userRepository = userRepository;
    this.roleRepository = roleRepository;
    this.authSettingsRepository = authSettingsRepository;
  }

  async doLogin(email: string, password: string): Promise<{}> {
    const user = await this.userRepository.findByEmail(email);
    if (user && user.password === password) {
      const authSettings: AuthSettings = new AuthSettings(
        await this.authSettingsRepository.find(),
      );
      const roles = await this.findRolesByUserId(user.id);

      const token = Jwt.sign(
        {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            isBlocked: user.isBlocked,
          },
          roles: roles,
        },
        authSettings.jwtSecret || "secret",
        {
          expiresIn: authSettings.tokenDurability,
        },
      );

      return { token: token };
    } else {
      throw new InvalidPasswordError(
        `Invalid e-mail or password for ${email}.`,
      );
    }
  }

  async findRolesByUserId(userId: string): Promise<string[]> {
    const roles: Role[] = await this.roleRepository.findRolesByUserId(userId);
    return roles.map((role) => role.name);
  }
}
