import { AppDataSource } from "../database";
import { UserGroup } from "../entities/UserGroup";

export const UserGroupRepository = AppDataSource.getRepository(UserGroup)