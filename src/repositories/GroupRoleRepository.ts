import { pool } from "../database/index";
import { Role } from "../entities/Role";

const FIND = `SELECT group_id, role_id FROM venus.group_role`
const INSERT = `INSERT INTO venus.group_role (group_id, role_id) VALUES($1, $2)`;
const DELETE = `DELETE FROM venus.group_role WHERE group_id=$1`

export class GroupRoleRepository {
    static async findAll() {
        const result = await pool.query(FIND);
        return result.rows;
    }

    static async findByGroupId(id: string) {
        const result = await pool.query(`${FIND} WHERE group_id = $1`, [id]);
        return result.rows;
    }

    static async persist(groupId: string, roles: Role[]) {
        roles.forEach(async role => {
            await pool.query(INSERT, [groupId, role.id]);
        });
    }

    static async destroy(groupId: string) {
        const result = await pool.query(DELETE, [groupId]);

    }
}