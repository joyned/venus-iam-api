import { v4 } from "uuid";
import { pool } from "../database/index";
import { Group } from "../entities/Group";

const FIND = `SELECT id, "name", created_at, last_update FROM venus."group"`
const FIND_GROUPS_BY_USER = `select g.* from venus."group" g join venus.user_group ug  on ug.group_id = g.id and ug.user_id = $1`
const INSERT = `INSERT INTO venus."group" (id, "name", created_at, last_update) VALUES($1, $2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);`;
const UPDATE = 'UPDATE venus."group" SET "name"=$2, last_update=CURRENT_TIMESTAMP WHERE id=$1;'
const DELETE = `DELETE FROM venus."group" WHERE id=$1`

export class GroupRepository {
    static async findAll() {
        const result = await pool.query(FIND);

        return result.rows;
    }

    static async findById(id: string) {
        const result = await pool.query(`${FIND} WHERE id = $1`, [id]);

        return result.rows[0]
    }

    static async findGroupsByUserId(userId: string) {
        const result = await pool.query(FIND_GROUPS_BY_USER, [userId]);
        return result.rows;
    }

    static async persist(group: Group) {
        let result = undefined;

        if (!group.id) {
            group.id = v4();
            result = await pool.query(INSERT, [group.id, group.name]);
        } else {
            result = await pool.query(UPDATE, [group.id, group.name]);
        }

        if (result.rowCount == 1) {
            return group;
        }

        return undefined;
    }

    static async destroy(id: string) {
        const result = await pool.query(DELETE, [id]);
        if (result.rowCount == 1) {
            return id;
        }

        return undefined;
    }
}