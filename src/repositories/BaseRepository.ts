import { pool } from "../database";
import { loggerFactory } from "../logger";

const logger = loggerFactory("BaseRepository");

const executeQuery = async (query: string, params: any[] = []) => {
  try {
    logger.info(`Executing query: ${query} with params: ${params}`);
    return await pool.query(query, params);
  } catch (e) {
    logger.error(`Error executing query: ${query} with params: ${params}`, e);
    throw e;
  }
};

const beginTransaction = async () => {
  logger.info(`Begining transaction...`);
  return await pool.query("BEGIN");
};

const rollbackTransation = async () => {
  logger.info(`Rollbacking transaction...`);
  return await pool.query("ROLLBACK");
};

const commitTransation = async () => {
  logger.info(`Commiting transaction...`);
  return await pool.query("COMMIT");
};

export { executeQuery, beginTransaction, rollbackTransation, commitTransation };
