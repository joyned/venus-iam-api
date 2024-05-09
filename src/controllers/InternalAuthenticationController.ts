import { Router } from "express";
import { InvalidPasswordError } from "../exceptions/InvalidPasswordError";
import { AuthenticationService } from "../services/AuthenticationService";
import { UserRepository } from "../repositories/UserRepository";
import { RoleRepository } from "../repositories/RoleRepository";
import { mapAuthenticationToDTO } from "./mapper";
import { loggerFactory } from "../logger";

const logger = loggerFactory("InternalAuthenticationController");
const internalAuthenticationController = Router();
const service = new AuthenticationService(
  new UserRepository(),
  new RoleRepository(),
);

internalAuthenticationController.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const [user, token, refreshToken] = await service.login(email, password);
    return res
      .cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'strict' })
      .send(mapAuthenticationToDTO(user, token));
  } catch (error) {
    logger.error(`Error while trying to login: ${error}`);
    if (error instanceof InvalidPasswordError) {
      return res.status(401).json({ message: error.message });
    }
    return res.status(500).json({ message: "Internal server error." });
  }
});

internalAuthenticationController.post("/refresh-token", async (req, res) => {
  const refreshToken = req.cookies['refreshToken'];
  if (!refreshToken) {
    return res.status(400).json({ message: "Token not provided." });
  }

  const authentication = await service.refreshToken(refreshToken);
  if (!authentication) {
    return res.status(401).json({ message: "Invalid token." });
  }

  return res.json(authentication);
});

export default internalAuthenticationController;
