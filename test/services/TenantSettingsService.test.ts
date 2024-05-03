import { mock, MockProxy } from "jest-mock-extended";
import { TenantSettingsService } from "../../src/services/TenantSettingsService";
import { TenantSettingsRepository } from "../../src/repositories/TenantSettingsRepository";
import { TenantSettings } from "../../src/entities/TenantSettings";

describe("TenantSettingsService", () => {
  let tenantSettingsService: TenantSettingsService;
  let tenantSettingsRepositoryMock: MockProxy<TenantSettingsRepository>;

  beforeEach(() => {
    tenantSettingsRepositoryMock = mock<TenantSettingsRepository>();
    tenantSettingsService = new TenantSettingsService(
      tenantSettingsRepositoryMock,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should persist tenant settings and return persisted settings", async () => {
    const tenantSettings: TenantSettings = {
      name: "Test Tenant",
      primaryColor: "#111827",
      secondColor: "#1f2937",
      textColor: "#f9fafb",
    };
    tenantSettingsRepositoryMock.persist.mockResolvedValue(tenantSettings);

    const result = await tenantSettingsService.persist(tenantSettings);

    expect(tenantSettingsRepositoryMock.persist).toHaveBeenCalledWith(
      tenantSettings,
    );
    expect(result).toEqual(new TenantSettings(tenantSettings));
  });

  it("should throw an error when name is not provided", async () => {
    const tenantSettings: TenantSettings = {
      primaryColor: "#111827",
      secondColor: "#1f2937",
      textColor: "#f9fafb",
      name: undefined as any,
    };

    await expect(tenantSettingsService.persist(tenantSettings)).rejects.toThrow(
      "Name is required",
    );
  });

  it("should set default colors when not provided", async () => {
    const tenantSettings: TenantSettings = {
      name: "Test Tenant",
      primaryColor: "",
      secondColor: "",
      textColor: "",
    };
    const expectedTenantSettings: TenantSettings = {
      name: "Test Tenant",
      primaryColor: "#111827",
      secondColor: "#1f2937",
      textColor: "#f9fafb",
    };

    tenantSettingsRepositoryMock.persist.mockResolvedValue(
      expectedTenantSettings,
    );

    const result = await tenantSettingsService.persist(tenantSettings);

    expect(tenantSettingsRepositoryMock.persist).toHaveBeenCalledWith(
      expectedTenantSettings,
    );
    expect(result).toEqual(new TenantSettings(expectedTenantSettings));
  });
});
