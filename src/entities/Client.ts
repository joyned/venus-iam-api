
export class Client {
    declare id: string;
    declare name: string;
    declare url: string;
    declare clientSecret: string;
    declare allowedUrls: string[];
    declare createdAt: Date;

    constructor(data?: any) {
        if (data) {
            this.id = data.id;
            this.name = data.name;
            this.url = data.url;
            this.clientSecret = data.client_secret;
            this.allowedUrls = data.allowed_urls;
            this.createdAt = new Date(data.created_at);
        }
    }
}