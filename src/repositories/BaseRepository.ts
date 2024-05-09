import { PoolClient, QueryResult } from "pg";
import { pool } from "../database";
import { loggerFactory } from "../logger";

const logger = loggerFactory("BaseRepository");

const executeQuery = async (query: string, params: any[] = []): Promise<QueryResult<any>> => {
  try {
    logger.info(`Executing query: ${query} with params: ${params}`);
    return await pool.query(query, params);
  } catch (e) {
    logger.error(`Error executing query: ${query} with params: ${params}`, e);
    throw e;
  }
};

const executeTransaction = async (callback: (transaction: PoolClient) => Promise<any>) => {
  const transaction = await pool.connect();
  try {
    await transaction.query('BEGIN')
    try {
      await callback(transaction)
      await transaction.query('COMMIT')
    } catch (e) {
      await transaction.query('ROLLBACK')
    }
  } finally {
    transaction.release()
  }
}

export { executeQuery, executeTransaction };

