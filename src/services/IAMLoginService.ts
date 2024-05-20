import { Client } from '../entities/Client';
import { TenantSettings } from '../entities/TenantSettings';
import { ClientNotFoundError } from '../exceptions/ClientNotFoundError';
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

    if (!clientId) {
      throw new ClientNotFoundError(`Client ${clientId} not found`);
    }

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
