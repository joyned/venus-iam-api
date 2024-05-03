import { AuthSettings } from "../entities/AuthSettings";
import { AuthSettingsRepository } from "../repositories/AuthSettingsRepository";

export class AuthSettingsService {
  authSettingsRepository: AuthSettingsRepository;

  constructor(authSettingsRepository: AuthSettingsRepository) {
    this.authSettingsRepository = authSettingsRepository;
  }

  async find(): Promise<AuthSettings> {
    return new AuthSettings(await this.authSettingsRepository.find());
  }

  async update(authSettings: AuthSettings): Promise<AuthSettings> {
    if (
      authSettings.generateRefreshToken == undefined ||
      !authSettings.tokenDurability
    ) {
      throw new Error(
        `Failed to update Auth settings. Null parameters are not allowed.`,
      );
    }
    return new AuthSettings(
      await this.authSettingsRepository.update(authSettings),
    );
  }
}
