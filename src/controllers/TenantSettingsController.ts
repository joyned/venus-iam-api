import { Router } from 'express';
import { TenantSettingsRepository } from '../repositories/TenantSettingsRepository';
import { TenantSettingsService } from '../services/TenantSettingsService';
import { mapTenantSettingsToDTO } from './mapper';
import { authenticationMiddleware } from '../middleware/AuthenticationMiddleware';

const tenantSettingsController = Router();
const service = new TenantSettingsService(new TenantSettingsRepository());

tenantSettingsController.get(
  '/',
  authenticationMiddleware(['SYSTEM_ADMIN', 'SYSTEM_VIEWER']),
  async (req, res) => {
    const tenantSettings = mapTenantSettingsToDTO(await service.find());
    res.json(tenantSettings);
  }
);

tenantSettingsController.post(
  '/',
  authenticationMiddleware(['SYSTEM_ADMIN']),
  async (req, res) => {
    const requestBody = req.body || {};
    const tenantSettings = mapTenantSettingsToDTO(
      await service.persist({
        name: requestBody.name,
        primaryColor: requestBody.primaryColor,
        secondColor: requestBody.secondColor,
        textColor: requestBody.textColor,
      })
    );
    return res.json(tenantSettings);
  }
);

tenantSettingsController.post(
  '/image',
  authenticationMiddleware(['SYSTEM_ADMIN']),
  async (req, res) => {
    const requestBody = req.body || {};

    if (!requestBody.image) {
      return res.status(400).json({ error: 'Image is required' });
    }

    const image = await service.updateImage(requestBody.image);
    return res.json(image);
  }
);

export default tenantSettingsController;
