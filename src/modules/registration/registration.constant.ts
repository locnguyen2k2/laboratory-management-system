import { ItemStatusEnum } from 'src/enums/item-status-enum.enum';

export interface ItemRegistration {
  itemId: number;
  quantity: number;
  roomId: number;
  status: ItemStatusEnum;
}

export enum RegistrationStatusEnum {
  BORROWING = 0,
  RETURNED = 1,
}
