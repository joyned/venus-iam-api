import { Router } from 'express';
import { UserService } from '../services/UserService';
import { mapUsersToDTO, mapUserToDTO } from './mapper';
import { authenticationMiddleware } from '../middleware/AuthenticationMiddleware';

const userController = Router();
const service = new UserService();

userController.get('/', authenticationMiddleware(['SYSTEM_ADMIN', 'SYSTEM_VIEWER']),  async (req, res) => {
  return res.json(mapUsersToDTO(await service.findAll()));
});

userController.get('/:id', authenticationMiddleware(['SYSTEM_ADMIN', 'SYSTEM_VIEWER']), async (req, res) => {
  return res.json(mapUserToDTO(await service.findById(req.params.id)));
});

userController.post('/', authenticationMiddleware(['SYSTEM_ADMIN']), async (req, res) => {
  return res.json(await service.persist(req.body));
});

userController.delete('/:id', authenticationMiddleware(['SYSTEM_ADMIN']), async (req, res) => {
  return res.json(await service.delete(req.params.id));
});

export default userController;
