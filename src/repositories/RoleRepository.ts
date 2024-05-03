import { v4 } from 'uuid';
import { Role } from '../entities/Role';
import { executeQuery } from './BaseRepository';

const FIND = 'SELECT id, "name", created_at FROM venus."role"';
const FIND_ROLE_BY_GROUP_ID = `select r.* from venus."role" r join venus.group_role gr on r.id = gr.role_id and gr.group_id = $1`;
const FIND_ROLES_BY_USER_ID = `select r.* from venus."role" r join venus.group_role gr on gr.role_id = r.id join venus.user_group ug on ug.user_id = $1 and ug.group_id = gr.group_id`;
const INSERT =
  'INSERT INTO venus."role" (id, "name", created_at) VALUES($1, $2, CURRENT_TIMESTAMP)';
const UPDATE = 'UPDATE venus."role" SET "name"=$2 WHERE id=$1';
const DELETE = `DELETE FROM venus."role" WHERE id=$1`;

export class RoleRepository {
  async findAll() {
    const result = await executeQuery(FIND);

    return result.rows;
  }

  async findById(id: string) {
    const result = await executeQuery(`${FIND} WHERE id = $1`, [id]);

    return result.rows[0];
  }

  async findRolesByGroupId(groupId: string) {
    const result = await executeQuery(FIND_ROLE_BY_GROUP_ID, [groupId]);
    return result.rows;
  }

  async findRolesByUserId(userId: string) {
    const result = await executeQuery(FIND_ROLES_BY_USER_ID, [userId]);
    return result.rows;
  }

  async persist(role: Role): Promise<Role | undefined> {
    let result = undefined;
    if (!role.id) {
      role.id = v4();
      role.createdAt = new Date();
      result = await executeQuery(INSERT, [role.id, role.name]);
    } else {
      result = await executeQuery(UPDATE, [role.id, role.name]);
    }

    if (result.rowCount == 1) {
      return role;
    }

    return undefined;
  }

  async destroy(id: string) {
    const result = await executeQuery(DELETE, [id]);
    if (result.rowCount == 1) {
      return id;
    }

    return undefined;
  }
}
