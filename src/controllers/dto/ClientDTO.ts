import { GroupDTO } from "./GroupDTO";

export interface ClientDTO {
  id: string;
  name: string;
  url: string;
  clientId: string;
  clientSecret: string;
  image: string;
  allowedUrls: string[];
  allowedGroups: GroupDTO[];
  createdAt: Date;
}
