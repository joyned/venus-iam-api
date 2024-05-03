import { AuthenticationDTO } from "../controllers/dto/AuthenticationDTO";
import { mapAuthenticationToDTO, mapRolesToDTO } from "../controllers/mapper";
import { Role } from "../entities/Role";
import { InvalidPasswordError } from "../exceptions/InvalidPasswordError";
import { RoleRepository } from "../repositories/RoleRepository";
import { UserRepository } from "../repositories/UserRepository";
import Jwt from "jsonwebtoken";

export class AuthenticationService {
  userRepository: UserRepository;
  roleRepository: RoleRepository;

  constructor(userRepository: UserRepository, roleRepository: RoleRepository) {
    this.userRepository = userRepository;
    this.roleRepository = roleRepository;
  }

  async login(
    email: string,
    password: string,
  ): Promise<AuthenticationDTO | undefined> {
    const user = await this.userRepository.findByEmail(email);

    if (user) {
      if (user.password !== password) {
        throw new InvalidPasswordError(`Invalid password for user ${email}.`);
      }

      //TODO: check if user has SYSTEM_ADMIN or SYSTEM_VIEWR role

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
        process.env.JWT_SECRET || "secret",
        {
          expiresIn: "1h",
        },
      );

      return mapAuthenticationToDTO(user, token);
    }
  }

  async findRolesByUserId(userId: string): Promise<string[]> {
    const roles: Role[] = await this.roleRepository.findRolesByUserId(userId);
    return roles.map((role) => role.name);
  }

  verifyToken(token: string): boolean {
    try {
      Jwt.verify(token, process.env.JWT_SECRET || "secret");
      return true;
    } catch (error) {
      return false;
    }
  }

  getUser(token: string): any {
    const decoded: any = Jwt.decode(token);
    return decoded?.user;
  }

  getRoles(token: string): string[] {
    const decoded: any = Jwt.decode(token);
    return decoded.roles || [];
  }
}
