import { ExtendedEntity } from "src/common/entity/common.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, Relation } from "typeorm";
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

    @ManyToMany(() => ScheduleEntity, schedule => schedule.roomRegistration)
    @JoinTable({
        name: 'room_registration_schedules',
        joinColumn: { name: 'room_registration_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'schedule_id', referencedColumnName: 'id' },
    })
    times: Relation<ScheduleEntity[]>;

    constructor(roomRegistrationEntity: Partial<RoomRegistrationEntity>) {
        super();
        Object.assign(this, roomRegistrationEntity)
    }
}