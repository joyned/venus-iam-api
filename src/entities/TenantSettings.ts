export class TenantSettings {
  declare name: string;
  declare primaryColor: string;
  declare secondColor: string;
  declare textColor: string;
  declare image?: string;

  constructor(data?: any) {
    if (data) {
      this.name = data.name;
      this.primaryColor = data.primary_color;
      this.secondColor = data.second_color;
      this.textColor = data.text_color;
      this.image = data.default_image;
    }
  }
}
