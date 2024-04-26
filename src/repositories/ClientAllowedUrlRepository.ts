import { AppDataSource } from "../database";
import { ClientAllowedUrl } from "../entities/ClientAllowedUrl";

export const ClientAllowedUrlRepository = AppDataSource.getRepository(ClientAllowedUrl);