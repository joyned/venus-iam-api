import { pool } from "../database";

const FIND = `SELECT client_id, url FROM venus.client_allowed_url`
const INSERT = `INSERT INTO venus.client_allowed_url (client_id, url) VALUES($1, $2);`;
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

    static async persist(clientId: string, allowedUrls: any[]) {
        allowedUrls.forEach(async allowedUrl => {
            await pool.query(INSERT, [clientId, allowedUrl.url]);
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