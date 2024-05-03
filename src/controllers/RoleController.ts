import { Router } from 'express';
import { v4 } from 'uuid';
import { Role } from '../entities/Role';
import { RoleService } from '../services/RoleService';
import { mapRolesToDTO, mapRoleToDTO } from './mapper';
import { authenticationMiddleware } from '../middleware/AuthenticationMiddleware';

const roleController = Router();
const service = new RoleService();

roleController.get(
  '/',
  authenticationMiddleware(['SYSTEM_ADMIN', 'SYSTEM_VIEWER']),
  async (req, res) => {
    return res.json(mapRolesToDTO(await service.findAll()));
  }
);

roleController.get(
  '/:roleId',
  authenticationMiddleware(['SYSTEM_ADMIN', 'SYSTEM_VIEWER']),
  async (req, res) => {
    return res.json(mapRoleToDTO(await service.findById(req.params.roleId)));
  }
);

roleController.post(
  '/',
  authenticationMiddleware(['SYSTEM_ADMIN']),
  async (req, res) => {
    let role: Role = new Role();

    if (req.body.id) {
      role.id = req.body.id;
    }

    role.name = req.body.name;
    role.createdAt = req.body.createdAt;

    try {
      return res.json(await service.persist(role));
    } catch (error) {
      return res.status(500).json(error);
    }
  }
);

roleController.delete(
  '/:roleId',
  authenticationMiddleware(['SYSTEM_ADMIN']),
  async (req, res) => {
    try {
      const result = await service.delete(req.params.roleId);
      if (result) {
        return res.json(req.params.roleId);
      } else {
        return res.status(404).json({ message: 'Not found.' });
      }
    } catch (error: any) {
      return res.status(500).json(error);
    }
  }
);

export default roleController;
