import { v4 } from "uuid";
import { pool } from "../database/index";
import { Role } from "../entities/Role";

const FIND = 'SELECT id, "name", created_at FROM venus."role"'
const FIND_ROLE_BY_GROUP_ID = `select r.* from venus."role" r join venus.group_role gr on r.id = gr.role_id and gr.group_id = $1`;
const INSERT = 'INSERT INTO venus."role" (id, "name", created_at) VALUES($1, $2, CURRENT_TIMESTAMP)';
const UPDATE = 'UPDATE venus."role" SET "name"=$2, created_at=$3 WHERE id=$1'
const DELETE = `DELETE FROM venus."role" WHERE id=$1`

export class RoleRepository {
    static async findAll() {
        const result = await pool.query(FIND);

        return result.rows;
    }

    static async findById(id: string) {
        const result = await pool.query(`${FIND} WHERE id = $1`, [id]);

        return result.rows[0]
    }

    static async findRolesByGroupId(groupId: string) {
        const result = await pool.query(FIND_ROLE_BY_GROUP_ID, [groupId]);
        return result.rows;
    }

    static async persist(role: Role): Promise<Role | undefined> {
        let result = undefined;
        if (!role.id) {
            role.id = v4();
            result = await pool.query(INSERT, [role.id, role.name]);
        } else {
            result = await pool.query(UPDATE, [role.id, role.name, role.createdAt]);
        }

        if (result.rowCount == 1) {
            return role;
        }

        return undefined
    }

    static async destroy(id: string) {
        const result = await pool.query(DELETE, [id]);

        return result.rows[0]
    }
}