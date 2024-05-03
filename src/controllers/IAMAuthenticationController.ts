import { Router } from 'express';
import { IAMAuthenticationService } from '../services/IAMAuthenticationService';
import { UserRepository } from '../repositories/UserRepository';
import { RoleRepository } from '../repositories/RoleRepository';
import { AuthSettingsRepository } from '../repositories/AuthSettingsRepository';

const iamAuthenticationController = Router();
const service = new IAMAuthenticationService(
  new UserRepository(),
  new RoleRepository(),
  new AuthSettingsRepository()
);

iamAuthenticationController.post('/', async (req, res) => {
  return res.json(await service.doLogin(req.body.email, req.body.password));
});

export default iamAuthenticationController;
