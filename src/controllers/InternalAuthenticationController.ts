import { Router } from 'express';
import { InvalidPasswordError } from '../exceptions/InvalidPasswordError';
import { AuthenticationService } from '../services/AuthenticationService';

const internalAuthenticationController = Router();
const service = new AuthenticationService();

internalAuthenticationController.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    return res.json(await service.login(email, password));
  } catch (error) {
    if (error instanceof InvalidPasswordError) {
      return res.status(401).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Internal server error.' });
  }
});

export default internalAuthenticationController;
