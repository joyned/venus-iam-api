export interface ClientDTO {
    id: string;
    name: string;
    url: string;
    clientId: string;
    clientSecret: string;
    allowedUrls: string[];
    createdAt: Date;
}
