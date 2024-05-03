import { System } from "../entities/System";
import { executeQuery } from "./BaseRepository";

export class SystemRepository {
    async findById(id: number) {
        const result = await executeQuery("SELECT ID, VERSION FROM VENUS.SYSTEM WHERE ID = $1", [id]);
        
        return result.rows[0]
    }

    async persist(system: System) {
        const result = await executeQuery(`INSERT INTO venus."system" (id, "version") VALUES($1, $2);`, [system.id, system.version]);
        return result.rows[0]
    }
}