import { Group } from "../entities/Group";
import { executeQuery } from "./BaseRepository";

const FIND = `SELECT user_id, group_id FROM venus.user_group`;
const INSERT =
  "INSERT INTO venus.user_group (user_id, group_id) VALUES($1, $2);";
const DELETE = `DELETE FROM venus."user_group" WHERE user_id=$1`;

export class UserGroupRepository {
  async findAll() {
    const result = await executeQuery(FIND);
    return result.rows;
  }

  async findByUserId(id: string) {
    const result = await executeQuery(`${FIND} WHERE user_id = $1`, [id]);
    return result.rows;
  }

  async persist(userId: string, groups: Group[]) {
    groups.forEach(async (group) => {
      await executeQuery(INSERT, [userId, group.id]);
    });
  }

  async destroy(id: string) {
    const result = await executeQuery(DELETE, [id]);
    if (result.rowCount == 1) {
      return id;
    }

    return undefined;
  }
}
