import { Router } from "express";
import { GroupService } from "../services/GroupService";

const groupController = Router();
const service = new GroupService();

groupController.get('/', async (req, res) => {
    return res.json(await service.findAll());
});

export default groupController;