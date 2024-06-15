import { Router } from 'express';
import { IAMAuthenticationService } from '../services/IAMAuthenticationService';
import { UserRepository } from '../repositories/UserRepository';
import { RoleRepository } from '../repositories/RoleRepository';
import { AuthSettingsRepository } from '../repositories/AuthSettingsRepository';
import { IAMLoginService } from '../services/IAMLoginService';
import { ClientRepository } from '../repositories/ClientRepository';
import { TenantSettingsRepository } from '../repositories/TenantSettingsRepository';
import { mapTenantSettingsToDTO } from './mapper';
import { ClientNotFoundError } from '../exceptions/ClientNotFoundError';

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
  try {
    return res.json(await service.doLogin(req.body.email, req.body.password));
  } catch (error: any) {
    return res.status(401).json({ message: error.message });
  }
});

iamAuthenticationController.get('/loginPageSettings/:id', async (req, res) => {
  const clientId = req.params.id as string;
  try {
    return res.json(
      mapTenantSettingsToDTO(await iamLoginService.getLoginPageSettings(clientId))
    );
  } catch (error: any) {
    if (error instanceof ClientNotFoundError) {
      return res.status(404).json({ message: error.message });
    }

    return res.status(500).json({ message: error.message });
  }
});

export default iamAuthenticationController;
