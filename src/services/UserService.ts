import { v4 } from "uuid";
import { User } from "../entities/User";
import { UserRepository } from "../repositories/UserRepository";
import { UserGroupRepository } from "../repositories/UserRoleRepository";
import { Group } from "../entities/Group";
import { GroupRepository } from "../repositories/GroupRepository";

export class UserService {

    async findAll(): Promise<User[]> {
        return await UserRepository.findAll();
    }

    async findById(id: string): Promise<User> {
        const user: User = await UserRepository.findById(id);
        const groups: Group[] = await GroupRepository.findGroupsByUserId(id);
        user.groups = []
        groups.forEach(group => user.groups.push(group));
        return user;
    }

    async persist(user: User): Promise<User | undefined> {
        if (!user.createdAt) {
            user.createdAt = new Date();
        }

        if (!user.id) {
            user.id = v4();
        }

        const persistedUser = await UserRepository.persist(user);
        if (persistedUser) {
            await UserGroupRepository.persist(persistedUser.id, persistedUser.groups);
            return persistedUser;
        }
        return undefined;
    }


    async delete(id: string): Promise<string | undefined> {
        await UserGroupRepository.destroy(id);
        const result = await UserRepository.destroy(id);

        if (result) {
            return id;
        }

        return undefined;
    }
}