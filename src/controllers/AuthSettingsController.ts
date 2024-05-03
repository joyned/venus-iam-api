import { Router } from 'express';
import { AuthSettingsService } from '../services/AuthSettingsService';
import { mapAuthSettingsToDTO } from './mapper';
import { AuthSettingsRepository } from '../repositories/AuthSettingsRepository';

const authSettingsController = Router();
const service = new AuthSettingsService(new AuthSettingsRepository());

authSettingsController.get('/', async (req, res) => {
  return res.json(mapAuthSettingsToDTO(await service.find()));
});

authSettingsController.post('/', async (req, res) => {
  try {
    return res.json(
      await service.update({
        generateRefreshToken: req.body.generateRefreshToken,
        tokenDurability: req.body.tokenDurability,
      })
    );
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
});

export default authSettingsController;
