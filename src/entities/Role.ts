export class Role {
  declare id: string;
  declare name: string;
  declare createdAt: Date;

  constructor(data?: any) {
    if (data) {
      this.id = data.id;
      this.name = data.name;
      this.createdAt = new Date(data.created_at);
    }
  }
}
