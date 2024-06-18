import { RoleEnum } from 'src/enums/role-enum.enum';
import { UserStatus } from '../user.constant';

export class SearchUserDto {
  firstName?: string;
  lastName?: string;
  address?: string;
  photo?: string;
  email?: string;
  status?: UserStatus;
  role?: RoleEnum;
}

export enum SortUserEnum {
  firstName = 'firstName',
  lastName = 'lastName',
  address = 'address',
  photo = 'photo',
  email = 'email',
  status = 'status',
  role = 'role',
  createdAt = 'createdAt',
  updatedAt = 'updatedAt',
  createBy = 'createBy',
  updateBy = 'updateBy',
}
