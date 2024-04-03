import { ExtendedEntity } from "src/common/entity/common.entity";
import { Column, Entity, JoinColumn, ManyToOne, Relation } from "typeorm";
import { RegistrationEntity } from "./../registration.entity";
import { RoomEntity } from "./../../rooms/room.entity";
import { ScheduleEntity } from "src/modules/schedules/schedule.entity";

@Entity('room_registration_entity')
export class RoomRegistrationEntity extends ExtendedEntity {
    @ManyToOne(() => RegistrationEntity, registration => registration.roomRegistration)
    @JoinColumn({ name: 'registration_id' })
    registration: Relation<RegistrationEntity>;

    @ManyToOne(() => RoomEntity, room => room.roomRegistration)
    @JoinColumn({ name: 'room_id' })
    room: Relation<RoomEntity>;

    @Column({ type: 'date' })
    start_day: string

    @Column({ type: 'date' })
    end_day: string
 
    @ManyToOne(() => ScheduleEntity, schedule => schedule.startRoomReg)
    @JoinColumn({ name: 'start_time_id' })
    start_time: string

    @ManyToOne(() => ScheduleEntity, schedule => schedule.endRoomReg)
    @JoinColumn({ name: 'end_time_id' })
    end_time: string

    constructor(roomRegistrationEntity: Partial<RoomRegistrationEntity>) {
        super();
        Object.assign(this, roomRegistrationEntity)
    }
}