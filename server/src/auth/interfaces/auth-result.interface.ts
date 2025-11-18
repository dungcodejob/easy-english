import { User } from '@app/entities';

export interface IAuthResult {
  user: User;
  accessToken: string;
  refreshToken: string;
}
