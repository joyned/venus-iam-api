import { UserDTO } from './UserDTO';

export interface AuthenticationDTO {
  user: UserDTO;
  token: string;
}
