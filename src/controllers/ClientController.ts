import { Router } from "express";
import { ClientService } from "../services/ClientService";

const clientController = Router();
const service = new ClientService();

clientController.get('/', async (req, res) => {
    return res.json(await service.findAll());
});

export default clientController;