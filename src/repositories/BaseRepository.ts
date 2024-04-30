import { pool } from '../database';
import { loggerFactory } from '../logger';

const logger = loggerFactory('BaseRepository');

const executeQuery = async (query: string, params: any[] = []) => {
  logger.info(`Executing query: ${query} with params: ${params}`);
  return await pool.query(query, params);
};

export { executeQuery };
