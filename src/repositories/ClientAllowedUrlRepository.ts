import { pool } from "../database";

const FIND = `SELECT id, client_id, url FROM venus.client_allowed_url`
const INSERT = `INSERT INTO venus.client_allowed_url (client_id, url) VALUES($1, $3);`;
const DELETE = `DELETE FROM venus."client_allowed_url" WHERE client_id=$1`

export class ClientAllowedUrlRepository {
    static async findAll() {
        const result = await pool.query(FIND);
        return result.rows;
    }

    static async findByClientId(id: string) {
        const result = await pool.query(`${FIND} WHERE client_id = $1`, [id]);
        return result.rows;
    }

    static async persist(clientId: string, urls: string[]) {
        urls.forEach(async url => {
            await pool.query(INSERT, [clientId, url]);
        });
    }

    static async destroy(id: string) {
        const result = await pool.query(DELETE, [id]);
        if (result.rowCount == 1) {
            return id;
        }

        return undefined;
    }
}