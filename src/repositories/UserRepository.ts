import { AppDataSource } from "../database";
import { User } from "../entities/User";

export const UserRepository = AppDataSource.getRepository(User)