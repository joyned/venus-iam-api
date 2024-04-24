import { AppDataSource } from "../database";
import { Group } from "../entities/Group";

export const GroupRepository = AppDataSource.getRepository(Group)