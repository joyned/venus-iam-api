export class System {
  declare id: string;
  declare version: string;

  constructor(data?: any) {
    if (data) {
      this.id = data.id;
      this.version = data.version;
    }
  }
}
