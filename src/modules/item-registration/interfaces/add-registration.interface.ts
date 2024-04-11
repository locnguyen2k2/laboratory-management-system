import { RoomEntity } from "src/modules/rooms/room.entity";
import { RegistrationEntity } from "./../../registration/registration.entity";
import { ItemStatusEnum } from "src/enums/item-status-enum.enum";

export interface IAddItemRegistration {
    user: number;
    start_day: string;
    end_day: string;
    itemId: number;
    quantity: number;
    status: ItemStatusEnum;
    registration: RegistrationEntity;
    room: RoomEntity;
}