import { v4 } from "uuid";
import { Group } from "../entities/Group";
import { Role } from "../entities/Role";
import { System } from "../entities/System";
import { GroupRepository } from "../repositories/GroupRepository";
import { RoleRepository } from "../repositories/RoleRepository";
import { SystemRepository } from "../repositories/SystemRepository";
import { SystemConstants } from "./SystemConstants";
import { loggerFactory } from "../logger";

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
    private readonly systemVersion: string = '1.0.0';

    async getSystemInfo() {
        return SystemRepository.findById(1);
    }

    async start() {
        try {
            if (!await this.alreadyConfigured()) {
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
        let result = undefined;
        let systemAdministratorRole = new Role();
        let systemViewerRole = new Role();

        systemAdministratorRole.name = SystemConstants.systemAdministratorRoleName;
        systemAdministratorRole.createdAt = new Date();

        systemViewerRole.name = SystemConstants.systemViewerRoleName;
        systemViewerRole.createdAt = new Date();

        result = await RoleRepository.persist(systemAdministratorRole);

        if (result) {
            systemAdministratorRole = result;
        } else {
            throw new Error('Failed to start Application...')
        }

        result = await RoleRepository.persist(systemViewerRole);

        if (result) {
            systemViewerRole = result;
        } else {
            throw new Error('Failed to start Application...')
        }


        return {
            systemAdministratorRole: systemAdministratorRole,
            systemViewerRole: systemViewerRole
        }
    }

    private async createGroups(roles: SystemCreatedRole) {
        let systemAdministratorGroup = new Group();
        let systemViewerGroup = new Group();

        systemAdministratorGroup.name = SystemConstants.systemAdministratorGroupName;
        systemAdministratorGroup.roles = [roles.systemAdministratorRole];
        systemAdministratorGroup.createdAt = new Date();
        systemAdministratorGroup.lastUpdate = new Date();

        systemViewerGroup.name = SystemConstants.systemViewerGroupName;
        systemViewerGroup.roles = [roles.systemViewerRole];
        systemViewerGroup.createdAt = new Date();
        systemViewerGroup.lastUpdate = new Date();

        await GroupRepository.persist(systemAdministratorGroup)
        await GroupRepository.persist(systemViewerGroup)
    }

    private async createSystemConfigs() {
        const system = new System();
        system.id = "1";
        system.version = this.systemVersion;

        await SystemRepository.persist(system);
    }

    private async alreadyConfigured(): Promise<boolean> {
        const system = await SystemRepository.findById(1);
        if (system) {
            this.logger.info(`System configured. Version ${system.get('version')}`);
            return true;
        }
        return false;
    }
}