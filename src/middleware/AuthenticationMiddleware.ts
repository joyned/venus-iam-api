import { loggerFactory } from '../logger';
import { RoleRepository } from '../repositories/RoleRepository';
import { UserRepository } from '../repositories/UserRepository';
import { AuthenticationService } from '../services/AuthenticationService';

const logger = loggerFactory(__filename);

export function authenticationMiddleware(roles: string[] = []) {
  return (req: any, res: any, next: any) => {
    const authService = new AuthenticationService(
      new UserRepository(),
      new RoleRepository()
    );
    const token = req.headers.authorization;

    if (!token) {
      logger.error('Unauthorized request. Token not found.');
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (authService.verifyToken(token.split(' ')[1])) {
      const user = authService.getUser(token.split(' ')[1]);
      logger.info(`User ${user.email} requested ${req.baseUrl}...`);
      const userRoles = authService.getRoles(token.split(' ')[1]);
      if (roles.some((value) => userRoles.includes(value)) || !roles.length) {
        return next();
      } else {
        logger.error(
          `Forbidden request. User ${user.email} does not have permission to access ${req.baseUrl}.`
        );
        return res.status(403).json({ message: 'Forbidden' });
      }
    } else {
      logger.error('Unauthorized request. Invalid token.');
      return res.status(401).json({ message: 'Unauthorized' });
    }
  };
}
