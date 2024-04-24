import { Router } from "express";
import { UserService } from "../services/UserService";

const userController = Router();
const service = new UserService();

userController.get('/', async (req, res) => {
    return res.json(await service.findAll());
});

userController.get('/:id', async (req, res) => {
    return res.json(await service.findById(req.params.id));
});



export default userController;