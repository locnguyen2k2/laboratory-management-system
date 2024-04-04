import { CommonEntity } from "src/common/entity/common.entity";
import { Column, Entity, ManyToMany, OneToMany, Relation } from "typeorm";
import { RoomRegistrationEntity } from "../registration/room_registration/room_registration.entity";

@Entity("schedule_entity")
export class ScheduleEntity extends CommonEntity {
    @Column({ type: 'time' })
    start: string

    @Column({ type: 'time' })
    end: string

    @ManyToMany(() => RoomRegistrationEntity, room => room.times)
    roomRegistration: Relation<RoomRegistrationEntity[]>

    constructor(scheduleEntity: Partial<ScheduleEntity>) {
        super();
        Object.assign(this, scheduleEntity)
    }
}