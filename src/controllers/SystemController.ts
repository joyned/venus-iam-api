import { Router } from "express";
import { SystemConfig } from "../systemConfig/SystemConfig";

const systemController = Router();
const systemConfig = new SystemConfig();

systemController.get("/info", async (req, res) => {
  return res.json(await systemConfig.getSystemInfo());
});

systemController.get("/ping", async (req, res) => {
  await systemConfig.getSystemInfo();
  return res.send("pong");
});

export default systemController;
