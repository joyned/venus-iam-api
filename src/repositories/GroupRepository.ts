import { v4 } from "uuid";
import { Group } from "../entities/Group";
import { executeQuery } from "./BaseRepository";

const FIND = `SELECT id, "name", created_at, last_update FROM venus."group"`;
const FIND_GROUPS_BY_USER = `select g.* from venus."group" g join venus.user_group ug  on ug.group_id = g.id and ug.user_id = $1`;
const INSERT = `INSERT INTO venus."group" (id, "name", created_at, last_update) VALUES($1, $2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);`;
const UPDATE =
  'UPDATE venus."group" SET "name"=$2, last_update=CURRENT_TIMESTAMP WHERE id=$1;';
const DELETE = `DELETE FROM venus."group" WHERE id=$1`;

export class GroupRepository {
  async findAll() {
    const result = await executeQuery(FIND);

    return result.rows;
  }

  async findById(id: string) {
    const result = await executeQuery(`${FIND} WHERE id = $1`, [id]);

    return result.rows[0];
  }

  async findGroupsByUserId(userId: string) {
    const result = await executeQuery(FIND_GROUPS_BY_USER, [userId]);
    return result.rows;
  }

  async persist(group: Group) {
    let result = undefined;

    if (!group.id) {
      group.id = v4();
      result = await executeQuery(INSERT, [group.id, group.name]);
    } else {
      result = await executeQuery(UPDATE, [group.id, group.name]);
    }

    if (result.rowCount == 1) {
      return group;
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
