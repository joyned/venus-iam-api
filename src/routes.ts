import { Router } from 'express';
import clientController from './controllers/ClientController';
import groupController from './controllers/GroupController';
import internalAuthenticationController from './controllers/InternalAuthenticationController';
import roleController from './controllers/RoleController';
import systemController from './controllers/SystemController';
import userController from './controllers/UserController';
import authSettingsController from './controllers/AuthSettingsController';

const routes = Router();

const basePath = '/v1';

routes.use(`${basePath}/system`, systemController);
routes.use(`${basePath}/user`, userController);
routes.use(`${basePath}/role`, roleController);
routes.use(`${basePath}/group`, groupController);
routes.use(`${basePath}/client`, clientController);
routes.use(
  `${basePath}/internalAuthentication`,
  internalAuthenticationController
);
routes.use(`${basePath}/authSettings`, authSettingsController);

export default routes;
