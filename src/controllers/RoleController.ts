import { Router } from "express";
import { RoleService } from "../services/RoleService";

const roleController = Router();
const service = new RoleService();

roleController.get('/', async (req, res) => {
    return res.json(await service.findAll());
});

export default roleController;