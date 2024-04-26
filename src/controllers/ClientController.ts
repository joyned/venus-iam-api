import { Router } from "express";
import { ClientService } from "../services/ClientService";

const clientController = Router();
const service = new ClientService();

clientController.get('/', async (req, res) => {
    return res.json(await service.findAll());
});

clientController.get('/:id', async (req, res) => {
    return res.json(await service.findById(req.params.id));
});

clientController.post('/', async (req, res) => {
    return res.json(await service.persist(req.body));
});

clientController.delete('/:id', async (req, res) => {
    return res.json(await service.delete(req.params.id));
});


export default clientController;