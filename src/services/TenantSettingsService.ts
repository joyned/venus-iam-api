import { TenantSettings } from "../entities/TenantSettings";
import { TenantSettingsRepository } from "../repositories/TenantSettingsRepository";

export class TenantSettingsService {
  tenantSettingsRepository: TenantSettingsRepository;

  constructor(tenantSettingsRepository: TenantSettingsRepository) {
    this.tenantSettingsRepository = tenantSettingsRepository;
  }

  async find() {
    return new TenantSettings(await this.tenantSettingsRepository.find());
  }

  async persist(tenantSettings: TenantSettings): Promise<TenantSettings> {
    if (!tenantSettings.name) {
      throw new Error("Name is required");
    }

    if (!tenantSettings.primaryColor) {
      tenantSettings.primaryColor = "#111827";
    }

    if (!tenantSettings.secondColor) {
      tenantSettings.secondColor = "#1f2937";
    }

    if (!tenantSettings.textColor) {
      tenantSettings.textColor = "#f9fafb";
    }

    return new TenantSettings(
      await this.tenantSettingsRepository.persist(tenantSettings),
    );
  }

  async updateImage(image: string) {
    return await this.tenantSettingsRepository.updateImage(image);
  }
}
