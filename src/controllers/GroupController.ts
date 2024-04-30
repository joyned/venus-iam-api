import { Router } from "express";
import { GroupService } from "../services/GroupService";
import { loggerFactory } from "../logger";
import { mapGroupsToDTO, mapGroupToDTO } from "./mapper";

const groupController = Router();
const service = new GroupService();
const logger = loggerFactory(__filename)

groupController.get('/', async (req, res) => {
    return res.json(mapGroupsToDTO(await service.findAll()));
});

groupController.get('/:id', async (req, res) => {
    return res.json(mapGroupToDTO(await service.findById(req.params.id)));
});

groupController.post('/', async (req, res) => {
    try {
        return res.json(await service.persist(req.body));
    } catch (error) {
        logger.error(error);
        return res.status(500).json(error);
    }
});

groupController.delete('/:id', async (req, res) => {
    try {
        const result = await service.delete(req.params.id);
        if (result) {
            return res.json(req.params.id);
        } else {
            return res.status(404).json({ message: 'Not found.' });
        }
    } catch (error: any) {
        logger.error(error);
        return res.status(500).json(error);
    }
});


export default groupController;