import { Router } from "express";
import { ClientService } from "../services/ClientService";
import { mapClientsToDTO, mapClientToDTO } from "./mapper";
import { authenticationMiddleware } from "../middleware/AuthenticationMiddleware";
import { InvalidClientIdError } from "../exceptions/InvalidClientIdError";
import { InvalidClientSecretError } from "../exceptions/InvalidClientSecretError";
import { InvalidRedirectUrlError } from "../exceptions/InvalidRedirectUrlError";

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

clientController.post('/checkCredentials', async (req, res) => {
    try {
        return res.json(await service.checkCredentials(req.body.clientId, req.body.clientSecret, req.body.redirectUrl));
    } catch (e) {
        if(e instanceof InvalidClientIdError || e instanceof InvalidClientSecretError || e instanceof InvalidRedirectUrlError) {
            return res.status(401).json({ message: e.message });
        } else {
            return res.status(500).json({ message: 'An error occurred.' });
        }
    }
});


export default clientController;