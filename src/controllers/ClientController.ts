import { Router } from "express";
import { ClientService } from "../services/ClientService";
import { mapClientsToDTO, mapClientToDTO } from "./mapper";
import { authenticationMiddleware } from "../middleware/AuthenticationMiddleware";

const clientController = Router();
const service = new ClientService();

clientController.get('/', authenticationMiddleware(['SYSTEM_ADMIN', 'SYSTEM_VIEWER']), async (req, res) => {
    return res.json(mapClientsToDTO(await service.findAll()));
});

clientController.get('/:id', authenticationMiddleware(['SYSTEM_ADMIN', 'SYSTEM_VIEWER']), async (req, res) => {
    return res.json(mapClientToDTO(await service.findById(req.params.id)));
});

clientController.post('/', authenticationMiddleware(['SYSTEM_ADMIN']), async (req, res) => {
    return res.json(await service.persist(req.body));
});

clientController.delete('/:id', authenticationMiddleware(['SYSTEM_ADMIN']), async (req, res) => {
    return res.json(await service.delete(req.params.id));
});


export default clientController;