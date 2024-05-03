import { GroupDTO } from "./GroupDTO";

export interface UserDTO {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  isBlocked: Boolean;
  groups: GroupDTO[];
}
