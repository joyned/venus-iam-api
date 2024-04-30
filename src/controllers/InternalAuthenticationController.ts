import { Router } from 'express';
import { AuthenticationService } from '../services/AuthenticationService';

const internalAuthenticationController = Router();
const service = new AuthenticationService();

internalAuthenticationController.post('/login', async (req, res) => {
  const { email, password } = req.body;
  return res.json(await service.login(email, password));
});

export default internalAuthenticationController;
