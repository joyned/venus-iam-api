import { pool } from "../database";

export class TransactionRepository {
    static async run(runnable: any) {
        try {
            await pool.query('BEGIN')
            const result = await runnable();
            await pool.query('COMMIT');
            return result;
        } catch (error) {
            console.error(`Error while executing transaction! ${error}`);
            await pool.query('ROLLBACK')
        }
    }
}