import { v4 } from "uuid";
import { User } from "../entities/User";
import { sequelize } from "../database";

export class UserService {

    async findAll(): Promise<User[]> {
        return await User.findAll();
    }

    async findById(id: string): Promise<User | null> {
        return await User.findOne({ where: { id: id } });
    }

    async persist(user: User): Promise<User> {
        if (!user.createdAt) {
            user.createdAt = new Date();
        }

        if (!user.id) {
            user.id = v4();
        }

        const newUser = await user.save();
        return newUser;
    }


    async delete(id: string): Promise<string | undefined> {
        return await sequelize.transaction(async t => {
            sequelize.query('DELETE FROM venus.user_groups WHERE user_id = ?', {
                replacements: [id],
                transaction: t
            });

            const r = await User.destroy({ where: { id: id } });

            if (r) {
                return id;
            }

            return undefined;
        })
    }
}