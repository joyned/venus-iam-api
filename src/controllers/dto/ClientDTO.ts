export interface ClientDTO {
  id: string;
  name: string;
  url: string;
  clientId: string;
  clientSecret: string;
  image: string;
  allowedUrls: string[];
  createdAt: Date;
}
