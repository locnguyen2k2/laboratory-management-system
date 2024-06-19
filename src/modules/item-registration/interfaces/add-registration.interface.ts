import { RoomEntity } from 'src/modules/rooms/room.entity';
import { RegistrationEntity } from './../../registration/registration.entity';
import { ItemStatusEnum } from 'src/enums/item-status-enum.enum';
// import { ItemRegistrationStatus } from '../item-registration.constant';

export interface IAddItemRegistration {
  user: number;
  start_day: number;
  end_day: number;
  itemId: number;
  quantity: number;
  // status: ItemRegistrationStatus;
  itemStatus: ItemStatusEnum;
  registration: RegistrationEntity;
  room: RoomEntity;
}
