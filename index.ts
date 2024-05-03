import cors from "cors";
import express from "express";
import "./src/logger";
import { loggerFactory } from "./src/logger/index";
import routes from "./src/routes";
import { SystemConfig } from "./src/systemConfig/SystemConfig";
import { errorHandler } from "./src/controllers/errorHandler/ErrorHandler";

const logger = loggerFactory(__filename);
const systemConfig = new SystemConfig();

systemConfig.start().then(async () => {
  const app = express();

  const requestMaxSize = process.env.REQUEST_MAX_SIZE || "5mb";

  logger.info(`Express configured with max request size of ${requestMaxSize}`);

  app.use(errorHandler);
  app.use(cors());
  app.use(express.json({ limit: requestMaxSize }));

  app.use(routes);

  await systemConfig.createDefaultUsers();

  return app.listen(process.env.SERVER_PORT || 3000, () => {
    logger.info(
      `Server is running on port ${process.env.SERVER_PORT || 3000}...`,
    );
  });
});
