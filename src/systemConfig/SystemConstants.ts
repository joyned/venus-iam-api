export class SystemConstants {
    static readonly systemAdministratorGroupName = 'System Administrator';
    static readonly systemAdministratorRoleName = 'SYSTEM_ADMIN';
    static readonly systemViewerGroupName = 'System Viewer'
    static readonly systemViewerRoleName = 'SYSTEM_VIEWER'
    static readonly systemRoles = [this.systemAdministratorRoleName, this.systemViewerRoleName];
    static readonly systemGroups = [this.systemAdministratorGroupName, this.systemViewerGroupName];
}