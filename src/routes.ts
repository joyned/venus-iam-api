import { Router } from "express";
import userController from "./controllers/UserController";
import roleController from "./controllers/RoleController";
import groupController from "./controllers/GroupController";

const routes = Router();

const basePath = '/v1'

routes.use(`${basePath}/user`, userController);
routes.use(`${basePath}/role`, roleController);
routes.use(`${basePath}/group`, groupController);

export default routes;