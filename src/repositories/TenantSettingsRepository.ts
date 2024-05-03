import { TenantSettings } from "../entities/TenantSettings";
import { executeQuery } from "./BaseRepository";

const FIND = `SELECT * FROM venus.tenant_settings`;
const INSERT = `INSERT INTO venus.tenant_settings (name, primary_color, second_color, text_color, default_image) VALUES ($1, $2, $3, $4, $5)`;
const UPDATE = `UPDATE venus.tenant_settings SET name = $1, primary_color = $2, second_color = $3, text_color = $4`;
const UPDATE_IMAGE = `UPDATE venus.tenant_settings SET default_image = $1`;

export class TenantSettingsRepository {
  async find() {
    const result = await executeQuery(FIND);
    return result.rows[0];
  }

  async persist(tenantSettings: TenantSettings) {
    const result = await executeQuery(UPDATE, [
      tenantSettings.name,
      tenantSettings.primaryColor,
      tenantSettings.secondColor,
      tenantSettings.textColor,
    ]);

    if (result.rowCount == 1) {
      return tenantSettings;
    }

    return undefined;
  }

  async updateImage(image: string) {
    const result = await executeQuery(UPDATE_IMAGE, [image]);

    if (result.rowCount == 1) {
      return image;
    }

    return undefined;
  }

  async insert(tenantSettings: TenantSettings) {
    const result = await executeQuery(INSERT, [
      tenantSettings.name,
      tenantSettings.primaryColor,
      tenantSettings.secondColor,
      tenantSettings.textColor,
      tenantSettings.image,
    ]);

    if (result.rowCount == 1) {
      return tenantSettings;
    }

    return undefined;
  }
}
