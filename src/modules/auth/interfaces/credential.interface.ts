import { AccountInfo } from 'src/modules/user/interfaces/AccountInfo.interface';

export interface Credential {
  userInfo: AccountInfo;
  access_token: string;
  refresh_token?: string;
}
