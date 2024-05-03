import { mock, MockProxy } from "jest-mock-extended";
import { AuthSettings } from "../../src/entities/AuthSettings";
import { AuthSettingsRepository } from "../../src/repositories/AuthSettingsRepository";
import { AuthSettingsService } from "../../src/services/AuthSettingsService";

describe("AuthSettingsService", () => {
  let authSettingsService: AuthSettingsService;
  let authSettingsRepositoryMock: MockProxy<AuthSettingsRepository>;

  beforeEach(() => {
    authSettingsRepositoryMock = mock<AuthSettingsRepository>();
    authSettingsService = new AuthSettingsService(authSettingsRepositoryMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should find auth settings", async () => {
    const authSettings: AuthSettings = {
      generateRefreshToken: true,
      tokenDurability: 3600,
    };
    authSettingsRepositoryMock.find.mockResolvedValue(authSettings);

    const result = await authSettingsService.find();

    expect(authSettingsRepositoryMock.find).toHaveBeenCalled();
    expect(result).toEqual(new AuthSettings(authSettings));
  });

  it("should update auth settings", async () => {
    const authSettings: AuthSettings = {
      generateRefreshToken: true,
      tokenDurability: 3600,
    };
    authSettingsRepositoryMock.update.mockResolvedValue(authSettings);

    const result = await authSettingsService.update(authSettings);

    expect(authSettingsRepositoryMock.update).toHaveBeenCalledWith(
      authSettings,
    );
    expect(result).toEqual(new AuthSettings(authSettings));
  });

  it("should not update auth settings with null parameters", async () => {
    const authSettings: any = {
      generateRefreshToken: undefined,
      tokenDurability: undefined,
    };

    await expect(authSettingsService.update(authSettings)).rejects.toThrow(
      new Error(
        `Failed to update Auth settings. Null parameters are not allowed.`,
      ),
    );
  });
});
