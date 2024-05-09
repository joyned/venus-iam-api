import Jwt from "jsonwebtoken";
import { AuthenticationDTO } from "../controllers/dto/AuthenticationDTO";
import { mapAuthenticationToDTO } from "../controllers/mapper";
import { Role } from "../entities/Role";
import { InvalidPasswordError } from "../exceptions/InvalidPasswordError";
import { RoleRepository } from "../repositories/RoleRepository";
import { UserRepository } from "../repositories/UserRepository";

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
  ): Promise<any> {
    const user = await this.userRepository.findByEmail(email);

    if (user) {
      if (user.password !== password) {
        throw new InvalidPasswordError(`Invalid password for user ${email}.`);
      }

      //TODO: check if user has SYSTEM_ADMIN or SYSTEM_VIEWR role

      const roles = await this.findRolesByUserId(user.id);

      const jwtPayload = {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          isBlocked: user.isBlocked,
        },
        roles: roles,
      };

      const token = this.generateJwt(jwtPayload, "1h");
      const refreshToken = this.generateJwt(jwtPayload, "1d");

      return [user, token, refreshToken];
    }
  }

  async refreshToken(refreshToken: string): Promise<AuthenticationDTO | undefined> {
    const tokenValid = this.verifyToken(refreshToken);
    if (!tokenValid) {
      return undefined;
    }

    const user = this.getUser(refreshToken);
    const jwt = this.generateJwt(user, "1h");

    return mapAuthenticationToDTO(user, jwt);
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

  generateJwt(payload: any, expiresIn: string): string {
    return Jwt.sign(
      payload,
      process.env.JWT_SECRET || "secret",
      {
        expiresIn: expiresIn,
      },
    );
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
