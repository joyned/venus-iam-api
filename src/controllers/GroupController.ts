import { Router } from 'express';
import { GroupService } from '../services/GroupService';
import { loggerFactory } from '../logger';
import { mapGroupsToDTO, mapGroupToDTO } from './mapper';
import { authenticationMiddleware } from '../middleware/AuthenticationMiddleware';
import { GroupRepository } from '../repositories/GroupRepository';
import { RoleRepository } from '../repositories/RoleRepository';
import { GroupRoleRepository } from '../repositories/GroupRoleRepository';
import { UserGroupRepository } from '../repositories/UserRoleRepository';

const groupController = Router();
const service = new GroupService(
  new GroupRepository(),
  new RoleRepository(),
  new GroupRoleRepository(),
  new UserGroupRepository()
);
const logger = loggerFactory(__filename);

groupController.get(
  '/',
  authenticationMiddleware(['SYSTEM_ADMIN', 'SYSTEM_VIEWER']),
  async (req, res) => {
    return res.json(mapGroupsToDTO(await service.findAll()));
  }
);

groupController.get(
  '/:id',
  authenticationMiddleware(['SYSTEM_ADMIN', 'SYSTEM_VIEWER']),
  async (req, res) => {
    return res.json(mapGroupToDTO(await service.findById(req.params.id)));
  }
);

groupController.post(
  '/',
  authenticationMiddleware(['SYSTEM_ADMIN']),
  async (req, res) => {
    try {
      return res.json(await service.persist(req.body));
    } catch (error) {
      logger.error(error);
      return res.status(500).json(error);
    }
  }
);

groupController.delete(
  '/:id',
  authenticationMiddleware(['SYSTEM_ADMIN']),
  async (req, res) => {
    try {
      const result = await service.delete(req.params.id);
      if (result) {
        return res.json(req.params.id);
      } else {
        return res.status(404).json({ message: 'Not found.' });
      }
    } catch (error: any) {
      logger.error(error);
      return res.status(500).json(error);
    }
  }
);

export default groupController;
