import { ItemStatusEnum } from 'src/enums/item-status-enum.enum';
import { ItemRegistrationStatus } from '../item-registration/item-registration.constant';

export interface ItemRegistration {
  itemId: number;
  quantity: number;
  roomId: number;
  status: ItemRegistrationStatus;
  itemStatus: ItemStatusEnum;
}

export enum RegistrationStatusEnum {
  BORROWING = 0,
  RETURNED = 1,
}
