import { ExtendedEntity } from "src/common/entity/common.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, Relation } from "typeorm";
import { RoomStatus } from "./room.constant";
import { RoomRegistrationEntity } from "./../registration/room_registration/room_registration.entity";
import { CategoryEntity } from "../categories/category.entity";

@Entity('room_entity')
export class RoomEntity extends ExtendedEntity {

    @Column()
    name: string;

    @Column()
    quantity: number;

    @Column({ type: 'varchar', nullable: true })
    remark: string;

    @Column({ type: 'enum', enum: RoomStatus, default: RoomStatus.AVAILABLE, nullable: false })
    status: number;

    @OneToMany(() => RoomRegistrationEntity, roomRegistration => roomRegistration.room)
    roomRegistration: Relation<RoomRegistrationEntity[]>;

    @ManyToOne(() => CategoryEntity, category => category.rooms)
    @JoinColumn({ name: 'category_id' })
    category: Relation<CategoryEntity>

    constructor(roomEntity: Partial<RoomEntity>) {
        super();
        Object.assign(this, roomEntity)
    }
}