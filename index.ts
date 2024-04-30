import cors from "cors";
import express from "express";
import "./src/logger";
import { loggerFactory } from "./src/logger";
import routes from "./src/routes";
import { SystemConfig } from "./src/systemConfig/SystemConfig";
import { associations } from "./src/entities/Associations";

const logger = loggerFactory(__filename);
const systemConfig = new SystemConfig();

systemConfig.start().then(() => {
    associations()

    const app = express();

    app.use(cors())
    app.use(express.json());

    app.use(routes);

    return app.listen(process.env.SERVER_PORT || 3000, () => {
        logger.info(`Server is running on port ${process.env.SERVER_PORT || 3000}...`)
    });
});
