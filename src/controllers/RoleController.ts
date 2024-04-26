import { Router } from "express";
import { RoleService } from "../services/RoleService";
import { Role } from "../entities/Role";
import { v4 } from "uuid";
import { DeletionError } from "../exceptions/DeletionError";

const roleController = Router();
const service = new RoleService();

roleController.get('/', async (req, res) => {
    return res.json(await service.findAll());
});

roleController.get('/:roleId', async (req, res) => {
    return res.json(await service.findById(req.params.roleId));
});

roleController.post('/', async (req, res) => {
    let role: Role = new Role();

    if (req.body.id) {
        role.id = req.body.id;
    } else {
        role.id = v4();
    }

    role.name = req.body.name;
    role.createdAt = new Date();

    try {
        return res.json(await service.persist(role));
    } catch (error) {
        return res.status(500).json(error);
    }
})

roleController.delete('/:roleId', async (req, res) => {
    try {
        const result = await service.delete(req.params.roleId);
        if (result) {
            return res.json(req.params.roleId);
        } else {
            return res.status(404).json({ message: 'Not found.' });
        }
    } catch (error: any) {
        return res.status(500).json(error);
    }
})

export default roleController;