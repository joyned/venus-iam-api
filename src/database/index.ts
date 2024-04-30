import "dotenv/config";
import "reflect-metadata";
import { Sequelize } from "sequelize";

const port = process.env.DB_PORT as number | undefined;

export const sequelize = new Sequelize({
    dialect: 'postgres',
    host: process.env.DB_HOST,
    port: port,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    schema: process.env.DB_SCHEMA,
    define: {
        timestamps: false,
        underscored: true,
    }
});