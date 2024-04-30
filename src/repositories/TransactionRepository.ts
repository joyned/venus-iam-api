import { executeQuery } from "./BaseRepository";

export class TransactionRepository {
    static async run(runnable: any) {
        try {
            await executeQuery('BEGIN')
            const result = await runnable();
            await executeQuery('COMMIT');
            return result;
        } catch (error) {
            console.error(`Error while executing transaction! ${error}`);
            await executeQuery('ROLLBACK')
        }
    }
}