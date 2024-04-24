import "dotenv/config";
import "reflect-metadata";
import { DataSource } from "typeorm";

const port = process.env.DB_PORT as number | undefined;

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: port,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    schema: process.env.DB_SCHEMA,
    entities: ['src/entities/*.ts']
});

