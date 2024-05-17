import { Client } from '../entities/Client';
import { TenantSettings } from '../entities/TenantSettings';
import { ClientRepository } from '../repositories/ClientRepository';
import { TenantSettingsRepository } from '../repositories/TenantSettingsRepository';
import { SystemConstants } from '../systemConfig/SystemConstants';

export class IAMLoginService {
  clientRepository: ClientRepository;
  tenantSettingsRepository: TenantSettingsRepository;

  constructor(
    clientRepository: ClientRepository,
    tenantSettingsRepository: TenantSettingsRepository
  ) {
    this.clientRepository = clientRepository;
    this.tenantSettingsRepository = tenantSettingsRepository;
  }

  async getLoginPageSettings(clientId: string): Promise<TenantSettings> {
    let loginPageSettings = new TenantSettings();
    const client = new Client(await this.clientRepository.findById(clientId));

    const tenantSettings = new TenantSettings(
      await this.tenantSettingsRepository.find()
    );

    loginPageSettings.image = client.image || tenantSettings.image;
    loginPageSettings.name = client.name || tenantSettings.name || 'IAM';
    loginPageSettings.primaryColor =
      tenantSettings.primaryColor || SystemConstants.defaultPrimaryColor;
    loginPageSettings.secondColor =
      tenantSettings.secondColor || SystemConstants.defaultSecondColor;
    loginPageSettings.textColor =
      tenantSettings.textColor || SystemConstants.defaultTextColor;

    return loginPageSettings;
  }
}
