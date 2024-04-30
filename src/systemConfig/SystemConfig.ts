import { v4 } from "uuid";
import { Group } from "../entities/Group";
import { Role } from "../entities/Role";
import { System } from "../entities/System";
import { loggerFactory } from "../logger";
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
    private readonly systemVersion: string = '1.0.0';

    async getSystemInfo() {
        return System.findOne({ where: { id: 1 } })
    }

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

        await systemAdministratorRole.save()
        await systemViewerRole.save()

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

        await systemAdministratorGroup.save();
        await systemViewerGroup.save();
    }

    private async createSystemConfigs() {
        const system = new System();
        system.set('id', 1);
        system.set('version', this.systemVersion)

        await system.save();
    }

    private async alreadyConfigured(): Promise<boolean> {
        const system = await System.findOne({ where: { id: 1 } });
        if (system) {
            this.logger.info(`System configured. Version ${system.get('version')}`);
            return true;
        }
        return false;
    }
}