import { User } from "../entities/User";
import { UserRepository } from "../repositories/UserRepository";

export class UserService {

    async findAll(): Promise<User[]> {
        return await UserRepository.find();
    }

    async findById(id: string): Promise<User | null> {
        return await UserRepository.findOne({ where: { id: id } });
    }

    async create(user: User): Promise<User> {
        const newUser = await UserRepository.save(user);
        return newUser;
    }
}