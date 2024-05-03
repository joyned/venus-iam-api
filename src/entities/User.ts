import { Group } from "./Group";

export class User {
  declare id: string;
  declare name: string;
  declare email: string;
  declare password: string;
  declare createdAt: Date;
  declare isBlocked: Boolean;
  declare groups: Group[];

  constructor(data?: any) {
    if (data) {
      this.id = data.id;
      this.name = data.name;
      this.email = data.email;
      this.password = data.password;
      this.createdAt = new Date(data.created_at);
      this.isBlocked = data.is_blocked;
      this.groups = data.groups.map((groupData: any) => new Group(groupData));
    }
  }
}
