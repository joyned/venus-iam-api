import { Group } from "../entities/Group";
import { GroupRepository } from "../repositories/GroupRepository";

export class GroupService {
    async findAll(): Promise<Group[]> {
        return await GroupRepository.find();
    }
}