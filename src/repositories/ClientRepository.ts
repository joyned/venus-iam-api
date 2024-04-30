import { v4 } from "uuid";
import { pool } from "../database/index";
import { Client } from "../entities/Client";
import { ClientAllowedUrlRepository } from "./ClientAllowedUrlRepository";

const FIND = `SELECT id, "name", url, client_secret, created_at FROM venus.client`
const INSERT = `INSERT INTO venus.client (id, "name", url, client_secret, created_at) VALUES($1, $2, $3, $4, CURRENT_TIMESTAMP)`;
const UPDATE = 'UPDATE venus.client SET "name"=$2, url=$3 WHERE id=$1';
const DELETE = `DELETE FROM venus."client" WHERE id=$1`

export class ClientRepository {
    static async findAll() {
        let clients: Client[] = []
        const result = await pool.query(FIND);

        return result.rows;
    }

    static async findById(id: string) {
        const result = await pool.query(`${FIND} WHERE id = $1`, [id]);

        return result.rows[0];
    }

    static async persist(client: Client) {
        let result = undefined;

        if (!client.id) {
            client.id = v4()
            client.createdAt = new Date();
            result = await pool.query(INSERT, [client.id, client.name, client.url, client.clientSecret]);
        } else {
            result = await pool.query(UPDATE, [client.id, client.name, client.url]);
        }

        if (result.rowCount == 1) {
            return client;
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