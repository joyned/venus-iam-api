import { Router } from "express";
import { UserService } from "../services/UserService";
import { mapUsersToDTO, mapUserToDTO } from "./mapper";

const userController = Router();
const service = new UserService();

userController.get('/', async (req, res) => {
    return res.json(mapUsersToDTO(await service.findAll()));
});

userController.get('/:id', async (req, res) => {
    return res.json(mapUserToDTO(await service.findById(req.params.id)));
});

userController.post('/', async (req, res) => {
    return res.json(await service.persist(req.body))
});

userController.delete('/:id', async (req, res) => {
    return res.json(await service.delete(req.params.id))
});


export default userController;