import { AppDataSource } from "../database";
import { Role } from "../entities/Role";

export const RoleRepository = AppDataSource.getRepository(Role)