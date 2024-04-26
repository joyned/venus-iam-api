import express from "express";
import { AppDataSource } from './src/database'
import routes from "./src/routes";
import "./src/logger"
import { loggerFactory } from "./src/logger";
import cors from 'cors';
import { SystemConfig } from "./src/systemConfig/SystemConfig";

const logger = loggerFactory(__filename);
const systemConfig = new SystemConfig();

AppDataSource.initialize().then(() => {
    return systemConfig.start().then(() => {
        const app = express();

        app.use(cors())
        app.use(express.json());

        app.use(routes);

        return app.listen(process.env.SERVER_PORT || 3000, () => {
            logger.info(`Server is running on port ${process.env.SERVER_PORT || 3000}...`)
        });
    });
})
