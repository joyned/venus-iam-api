import { AuthSettings } from "../../entities/AuthSettings";
import { Client } from "../../entities/Client";
import { ClientAllowedUrl } from "../../entities/ClientAllowedUrl";
import { Group } from "../../entities/Group";
import { Role } from "../../entities/Role";
import { TenantSettings } from "../../entities/TenantSettings";
import { User } from "../../entities/User";
import { AuthSettingsDTO } from "../dto/AuthSettingsDTO";
import { AuthenticationDTO } from "../dto/AuthenticationDTO";
import { ClientAllowedUrlDTO } from "../dto/ClientAllowedUrlDTO";
import { ClientDTO } from "../dto/ClientDTO";
import { GroupDTO } from "../dto/GroupDTO";
import { RoleDTO } from "../dto/RoleDTO";
import { UserDTO } from "../dto/UserDTO";

export function mapTenantSettingsToDTO(
  tenantSettings: TenantSettings,
): TenantSettings {
  return {
    name: tenantSettings.name,
    primaryColor: tenantSettings.primaryColor,
    secondColor: tenantSettings.secondColor,
    textColor: tenantSettings.textColor,
    image: tenantSettings.image,
  };
}

export function mapAuthenticationToDTO(
  user: User,
  token: string,
): AuthenticationDTO {
  return {
    user: mapUserToDTO(user),
    token: token,
  };
}

export function mapAuthSettingsToDTO(
  authSettings: AuthSettings,
): AuthSettingsDTO {
  return {
    generateRefreshToken: authSettings.generateRefreshToken,
    tokenDurability: authSettings.tokenDurability,
  };
}

export function mapClientToDTO(client: Client): ClientDTO {
  return {
    id: client.id,
    name: client.name,
    url: client.url,
    clientId: client.id,
    clientSecret: client.clientSecret,
    image: client.image,
    allowedUrls: client.allowedUrls?.map((url) => url),
    allowedGroups: client.allowedGroups?.map(mapGroupToDTO),
    createdAt: client.createdAt,
  };
}

export function mapClientAllowedUrlToDTO(
  clientAllowedUrl: ClientAllowedUrl,
): ClientAllowedUrlDTO {
  return {
    clientId: clientAllowedUrl.clientId,
    url: clientAllowedUrl.url,
  };
}

export function mapRoleToDTO(role: Role): RoleDTO {
  return {
    id: role.id,
    name: role.name,
    createdAt: role.createdAt,
  };
}

export function mapGroupToDTO(group: Group): GroupDTO {
  return {
    id: group.id,
    name: group.name,
    createdAt: group.createdAt,
    lastUpdate: group.lastUpdate,
    roles: group.roles?.map(mapRoleToDTO),
  };
}

export function mapUserToDTO(user: User): UserDTO {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    isBlocked: user.isBlocked,
    groups: user.groups?.map(mapGroupToDTO),
  };
}

export function mapClientsToDTO(clients: Client[]): ClientDTO[] {
  return clients.map(mapClientToDTO);
}

export function mapClientAllowedUrlsToDTO(
  clientAllowedUrls: ClientAllowedUrl[],
): ClientAllowedUrlDTO[] {
  return clientAllowedUrls.map(mapClientAllowedUrlToDTO);
}

export function mapRolesToDTO(roles: Role[]): RoleDTO[] {
  return roles.map(mapRoleToDTO);
}

export function mapGroupsToDTO(groups: Group[]): GroupDTO[] {
  return groups.map(mapGroupToDTO);
}

export function mapUsersToDTO(users: User[]): UserDTO[] {
  return users.map(mapUserToDTO);
}
