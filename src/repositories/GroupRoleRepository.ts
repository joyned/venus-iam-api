import { Role } from "../entities/Role";
import { executeQuery } from "./BaseRepository";

const FIND = `SELECT group_id, role_id FROM venus.group_role`;
const INSERT = `INSERT INTO venus.group_role (group_id, role_id) VALUES($1, $2)`;
const DELETE = `DELETE FROM venus.group_role WHERE group_id=$1`;

export class GroupRoleRepository {
  async findAll() {
    const result = await executeQuery(FIND);
    return result.rows;
  }

  async findByGroupId(id: string) {
    const result = await executeQuery(`${FIND} WHERE group_id = $1`, [id]);
    return result.rows;
  }

  async persist(groupId: string, roles: Role[]) {
    roles.forEach(async (role) => {
      await executeQuery(INSERT, [groupId, role.id]);
    });
  }

  async destroy(groupId: string) {
    const result = await executeQuery(DELETE, [groupId]);
    if (result.rowCount == 1) {
      return groupId;
    }

    return undefined;
  }
}
