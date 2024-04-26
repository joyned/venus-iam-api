import { Repository } from "typeorm";
import { v4 } from "uuid";
import { AppDataSource } from "../database";
import { Group } from "../entities/Group";
import { Role } from "../entities/Role";
import { System } from "../entities/System";
import { loggerFactory } from "../logger";
import { GroupRepository } from "../repositories/GroupRepository";
import { RoleRepository } from "../repositories/RoleRepository";
import { SystemConstants } from "./SystemConstants";

class SystemCreatedRole {
    systemAdministratorRole: Role;
    systemViewerRole: Role;

    constructor(systemAdministratorRole: Role, systemViewerRole: Role) {
        this.systemAdministratorRole = systemAdministratorRole;
        this.systemViewerRole = systemViewerRole;
    }
}

export class SystemConfig {

    private readonly logger = loggerFactory(__filename);

    private systemRepository: Repository<System> = AppDataSource.getRepository(System);
    private readonly systemVersion: string = '1.0.0';

    async start() {
        try {
            if (! await this.alreadyConfigured()) {
                this.logger.info(`Configuring System. Please wait...`);
                const roles = await this.createSystemRoles();
                await this.createGroups(roles);
                await this.createSystemConfigs();
                this.logger.info(`System configured. Version ${this.systemVersion}`);
            }
        } catch (error) {
            this.logger.error(`Error occured while starting server. ${error}`);

        }
    }

    private async createSystemRoles(): Promise<SystemCreatedRole> {
        const systemAdministratorRole = new Role();
        const systemViewerRole = new Role();

        systemAdministratorRole.id = v4();
        systemAdministratorRole.name = SystemConstants.systemAdministratorRoleName;
        systemAdministratorRole.createdAt = new Date();

        systemViewerRole.id = v4();
        systemViewerRole.name = SystemConstants.systemViewerRoleName;
        systemViewerRole.createdAt = new Date();

        await RoleRepository.save([systemAdministratorRole, systemViewerRole]);

        return {
            systemAdministratorRole: systemAdministratorRole,
            systemViewerRole: systemViewerRole
        }
    }

    private async createGroups(roles: SystemCreatedRole) {
        const systemAdministratorGroup = new Group();
        const systemViewerGroup = new Group();

        systemAdministratorGroup.id = v4();
        systemAdministratorGroup.name = SystemConstants.systemAdministratorGroupName;
        systemAdministratorGroup.roles = [roles.systemAdministratorRole];
        systemAdministratorGroup.createdAt = new Date();
        systemAdministratorGroup.lastUpdate = new Date();

        systemViewerGroup.id = v4();
        systemViewerGroup.name = SystemConstants.systemViewerGroupName;
        systemViewerGroup.roles = [roles.systemViewerRole];
        systemViewerGroup.createdAt = new Date();
        systemViewerGroup.lastUpdate = new Date();

        await GroupRepository.save([systemAdministratorGroup, systemViewerGroup]);
    }

    private async createSystemConfigs() {
        const system = new System();
        system.id = 1
        system.version = this.systemVersion;

        await this.systemRepository.save(system);
    }

    private async alreadyConfigured(): Promise<boolean> {
        const system = await this.systemRepository.findOneBy({ id: 1 });
        if (system) {
            this.logger.info(`System configured. Version ${system.version}`);
            return true;
        }
        return false;
    }
}