import { Router } from "express";
import { InvalidPasswordError } from "../exceptions/InvalidPasswordError";
import { AuthenticationService } from "../services/AuthenticationService";
import { UserRepository } from "../repositories/UserRepository";
import { RoleRepository } from "../repositories/RoleRepository";

const internalAuthenticationController = Router();
const service = new AuthenticationService(
  new UserRepository(),
  new RoleRepository(),
);

internalAuthenticationController.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    return res.json(await service.login(email, password));
  } catch (error) {
    if (error instanceof InvalidPasswordError) {
      return res.status(401).json({ message: error.message });
    }
    return res.status(500).json({ message: "Internal server error." });
  }
});

export default internalAuthenticationController;
