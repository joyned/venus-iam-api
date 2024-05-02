import { Router } from "express";
import { IAMAuthenticationService } from "../services/IAMAuthenticationService";

const iamAuthenticationController = Router();
const service = new IAMAuthenticationService();


iamAuthenticationController.post('/', async (req, res) => {
    return res.json(await service.doLogin(req.body.email, req.body.password));
})


export default iamAuthenticationController;