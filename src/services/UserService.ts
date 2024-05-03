import { v4 } from 'uuid';
import { User } from '../entities/User';
import { UserRepository } from '../repositories/UserRepository';
import { UserGroupRepository } from '../repositories/UserRoleRepository';
import { Group } from '../entities/Group';
import { GroupRepository } from '../repositories/GroupRepository';
import { TransactionRepository } from '../repositories/TransactionRepository';

export class UserService {
  userRepository: UserRepository;
  userGroupRepository: UserGroupRepository;
  groupRepository: GroupRepository;

  constructor(
    userRepository: UserRepository,
    userGroupRepository: UserGroupRepository,
    groupRepository: GroupRepository
  ) {
    this.userRepository = userRepository;
    this.userGroupRepository = userGroupRepository;
    this.groupRepository = groupRepository;
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.findAll();
  }

  async findById(id: string): Promise<User> {
    const user: User = await this.userRepository.findById(id);
    const groups: Group[] = await this.groupRepository.findGroupsByUserId(id);
    user.groups = [];
    groups.forEach((group) => user.groups.push(group));
    return user;
  }

  async persist(user: User): Promise<User | undefined> {
    this.userGroupRepository.destroy(user.id);
    const persistedUser = await this.userRepository.persist(user);
    if (persistedUser) {
      this.userGroupRepository.persist(persistedUser.id, persistedUser.groups);
      return persistedUser;
    }
    return undefined;
  }

  async delete(id: string): Promise<string | undefined> {
    return await TransactionRepository.run(async () => {
      this.userGroupRepository.destroy(id);
      const result = await this.userRepository.destroy(id);

      if (result) {
        return id;
      }

      return undefined;
    });
  }
}
