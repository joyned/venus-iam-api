import { v4 } from "uuid";
import { User } from "../entities/User";
import { UserRepository } from "../repositories/UserRepository";
import { AppDataSource } from "../database";

export class UserService {

    async findAll(): Promise<User[]> {
        return await UserRepository.find();
    }

    async findById(id: string): Promise<User | null> {
        return await UserRepository.findOne({ where: { id: id } });
    }

    async persist(user: User): Promise<User> {
        if (!user.createdAt) {
            user.createdAt = new Date();
        }

        if (!user.id) {
            user.id = v4();
        }

        const newUser = await UserRepository.save(user);
        return newUser;
    }


    async delete(id: string): Promise<string | undefined> {
        return await AppDataSource.manager.transaction(async (transactionalEntityManager) => {
            await transactionalEntityManager.query("DELETE FROM venus.user_groups WHERE user_id = $1", [id])
            const response = await transactionalEntityManager.getRepository(User)
                .createQueryBuilder()
                .delete()
                .where("id = :id", { id: id })
                .execute();

            if (response.affected === 1) {
                return id;
            }

            return undefined;
        });

    }
}