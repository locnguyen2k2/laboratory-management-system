import { CommonEntity } from "src/common/entity/common.entity";
import { Column, Entity } from "typeorm";

@Entity("schedule_entity")
export class ScheduleEntity extends CommonEntity {
    @Column({ type: 'time' })
    start: string

    @Column({ type: 'time' })
    end: string
}