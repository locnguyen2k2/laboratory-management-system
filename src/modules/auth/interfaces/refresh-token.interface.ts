import { IJwtPayload } from './jwt.interface';

export interface IRefreshToken {
  id: number;
  payload: IJwtPayload;
}
