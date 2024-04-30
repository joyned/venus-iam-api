import { resourceLimits } from "worker_threads";
import { pool } from "../database/index";
import { Group } from "../entities/Group";

const FIND = `SELECT user_id, group_id FROM venus.user_group`
const INSERT = 'INSERT INTO venus.user_group (user_id, group_id) VALUES($1, $2);';
const DELETE = `DELETE FROM venus."user_group" WHERE user_id=$1`

export class UserGroupRepository {
    static async findAll() {
        const result = await pool.query(FIND);
        return result.rows;
    }

    static async findByUserId(id: string) {
        const result = await pool.query(`${FIND} WHERE user_id = $1`, [id]);
        return result.rows;
    }

    static async persist(userId: string, groups: Group[]) {
        groups.forEach(async group => {
            await pool.query(INSERT, [userId, group.id]);
        })
    }

    static async destroy(id: string) {
        const result = await pool.query(DELETE, [id]);
        if (result.rowCount == 1) {
            return id;
        }

        return undefined;
    }
}