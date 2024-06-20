import { RegistrationEntity } from './../../registration/registration.entity';
import { ItemStatusEnum } from 'src/enums/item-status-enum.enum';

export interface IAddItemRegistration {
  user: number;
  start_day: number;
  end_day: number;
  quantity: number;
  itemStatus: ItemStatusEnum;
  registration: RegistrationEntity;
  roomItemId: number;
}
