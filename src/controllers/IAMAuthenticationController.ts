import { Router } from 'express';
import { IAMAuthenticationService } from '../services/IAMAuthenticationService';
import { UserRepository } from '../repositories/UserRepository';
import { RoleRepository } from '../repositories/RoleRepository';
import { AuthSettingsRepository } from '../repositories/AuthSettingsRepository';
import { IAMLoginService } from '../services/IAMLoginService';
import { ClientRepository } from '../repositories/ClientRepository';
import { TenantSettingsRepository } from '../repositories/TenantSettingsRepository';
import { mapTenantSettingsToDTO } from './mapper';

const iamAuthenticationController = Router();
const service = new IAMAuthenticationService(
  new UserRepository(),
  new RoleRepository(),
  new AuthSettingsRepository()
);

const iamLoginService = new IAMLoginService(
  new ClientRepository(),
  new TenantSettingsRepository()
);

iamAuthenticationController.post('/', async (req, res) => {
  return res.json(await service.doLogin(req.body.email, req.body.password));
});

iamAuthenticationController.get('/loginPageSettings/:id', async (req, res) => {
  const clientId = req.params.id as string;
  return res.json(
    mapTenantSettingsToDTO(await iamLoginService.getLoginPageSettings(clientId))
  );
});

export default iamAuthenticationController;
