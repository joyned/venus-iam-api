import { AuthSettings } from '../entities/AuthSettings';
import { Role } from '../entities/Role';
import { loggerFactory } from '../logger';
import {
  beginTransaction,
  commitTransation,
  executeQuery,
  rollbackTransation,
} from '../repositories/BaseRepository';
import { GroupRepository } from '../repositories/GroupRepository';
import { SystemRepository } from '../repositories/SystemRepository';
import { generatePassword } from '../utils/Utils';
import { SystemConstants } from './SystemConstants';

import { version } from '../../package.json';
import { UserService } from '../services/UserService';

export class SystemConfig {
  private readonly logger = loggerFactory(__filename);
  private readonly systemVersion: string = version;

  async getSystemInfo() {
    return SystemRepository.findById(1);
  }

  //TODO: melhorar essa classe

  async start() {
    try {
      if (!(await this.alreadyConfigured())) {
        await beginTransaction();
        this.logger.info(`Configuring System. Please wait...`);

        await this.initializeDatabase(
          SystemConstants.systemAdministratorRoleName,
          SystemConstants.systemViewerRoleName,
          SystemConstants.systemAdministratorGroupName,
          SystemConstants.systemViewerGroupName,
          this.systemVersion,
          generatePassword(50),
          SystemConstants.defaultTenantImage
        );

        this.logger.info(`System configured. Version ${this.systemVersion}`);
        await commitTransation();
      }
    } catch (error) {
      await rollbackTransation();
      this.logger.error(`Error occured while starting server. ${error}`);
    }
  }

  async createDefaultUsers() {
    try {
      const userService = new UserService();
      const adminUser: any = {
        name: 'Admin',
        email: process.env.ADMIN_USER_EMAIL || 'admin@venus.com',
        password: process.env.ADMIN_USER_PASSWORD || '123mudar',
        groups: await GroupRepository.findAll(),
      };

      await userService.persist(adminUser);
    } catch (error) {
      this.logger.error(`Error occured while creating default users. ${error}`);
    }
  }

  private async alreadyConfigured(): Promise<boolean> {
    const system = await SystemRepository.findById(1);
    if (system) {
      this.logger.info(`System configured. Version ${system.version}`);
      return true;
    }
    return false;
  }

  async initializeDatabase(
    role1: string,
    role2: string,
    groupName1: string,
    groupName2: string,
    systemVersion: string,
    jwtSecret: string,
    tenantImage: string
  ): Promise<void> {
    // Insert roles
    await executeQuery(
      `INSERT INTO venus.role (id, name, created_at) VALUES (uuid_generate_v4(), $1, NOW()), (uuid_generate_v4(), $2, NOW());`,
      [role1, role2]
    );

    // Get IDs of the inserted roles
    const adminRoleIdQuery = `SELECT id FROM venus.role WHERE name = $1;`;
    const viewerRoleIdQuery = `SELECT id FROM venus.role WHERE name = $1;`;

    const adminRoleId = await this.getSingleId(adminRoleIdQuery, [role1]);
    const viewerRoleId = await this.getSingleId(viewerRoleIdQuery, [role2]);

    // Insert groups with roles
    const insertGroupsQuery = `
        INSERT INTO venus.group (id, name, created_at, last_update)
        VALUES (uuid_generate_v4(), $1, NOW(), NOW()), (uuid_generate_v4(), $2, NOW(), NOW());
    `;

    await executeQuery(insertGroupsQuery, [groupName1, groupName2]);

    // Get IDs of the inserted groups
    const adminGroupId = await this.getSingleId(
      `SELECT id FROM venus.group WHERE name = $1;`,
      [groupName1]
    );
    const viewerGroupId = await this.getSingleId(
      `SELECT id FROM venus.group WHERE name = $1;`,
      [groupName2]
    );

    // Insert group roles
    const insertGroupRolesQuery = `
        INSERT INTO venus.group_role (group_id, role_id)
        VALUES ($1, $2), ($3, $4);
    `;

    await executeQuery(insertGroupRolesQuery, [
      adminGroupId,
      adminRoleId,
      viewerGroupId,
      viewerRoleId,
    ]);

    // Insert system config
    await executeQuery(
      `INSERT INTO venus.system (id, version) VALUES (1, $1);`,
      [systemVersion]
    );

    // Insert initial auth settings
    await executeQuery(
      `INSERT INTO venus.auth_settings (token_durability, generate_refresh_token, jwt_secret) VALUES (3600, true, $1);`,
      [jwtSecret]
    );

    // Insert initial tenant settings
    await executeQuery(
      `INSERT INTO venus.tenant_settings (name, primary_color, second_color, text_color, default_image) VALUES ('Default', '#111827', '#1f2937', '#f9fafb', $1);`,
      [tenantImage]
    );
  }

  private async getSingleId(
    queryString: string,
    params: any[]
  ): Promise<number> {
    const result: any = await executeQuery(queryString, params);
    return result.rows[0].id;
  }
}
