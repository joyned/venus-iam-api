import { Client } from "./Client";

export class ClientAllowedUrl {
  declare clientId: string;
  declare url: string;
  declare clients: Client[];

  constructor(data?: any) {
    if (data) {
      this.clientId = data.client_id;
      this.url = data.url;
      this.clients = data.clients.map(
        (clientData: any) => new Client(clientData),
      );
    }
  }
}
