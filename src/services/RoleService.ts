import { Role } from "../entities/Role";
import { RoleRepository } from "../repositories/RoleRepository";

export class RoleService {
    async findAll(): Promise<Role[]> {
        return await RoleRepository.find();
    }
}