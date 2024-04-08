import { RoomEntity } from "src/modules/rooms/room.entity";
import { RegistrationEntity } from "./../../registration/registration.entity";

export interface IAddItemRegistration {
    user: number;
    start_day: string;
    end_day: string;
    itemId: number;
    quantity: number;
    registration: RegistrationEntity;
    room: RoomEntity;
}