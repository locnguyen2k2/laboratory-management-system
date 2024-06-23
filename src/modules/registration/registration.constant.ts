import { ItemStatusEnum } from 'src/enums/item-status-enum.enum';
import { ItemRegistrationStatus } from '../item-registration/item-registration.constant';

export interface ItemRegistration {
  roomItemId: number;
  quantity: number;
  status: ItemRegistrationStatus;
  itemStatus: ItemStatusEnum;
}

export enum RegistrationStatusEnum {
  PENDING = 0,
  APPROVED = 1,
}
