import { pool } from "../database/index";
import { System } from "../entities/System";

export class SystemRepository {
    static async findById(id: number) {
        const result = await pool.query("SELECT ID, VERSION FROM VENUS.SYSTEM WHERE ID = $1", [id]);
        
        return result.rows[0]
    }

    static async persist(system: System) {
        const result = await pool.query(`INSERT INTO venus."system" (id, "version") VALUES($1, $2);`, [system.id, system.version]);
        return result.rows[0]
    }
}