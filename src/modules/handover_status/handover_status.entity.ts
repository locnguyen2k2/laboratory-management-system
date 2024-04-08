import { CommonEntity } from "src/common/entity/common.entity";
import { Column, Entity, OneToMany, Relation } from "typeorm";
import { RoomItemEntity } from "../room_items/room_item.entity";

@Entity({ name: 'handover_status_entity' })
export class HandoverStatusEntity extends CommonEntity {

    @Column()
    name: string;

    @OneToMany(() => RoomItemEntity, roomItem => roomItem.handover_status)
    roomItem: Relation<RoomItemEntity[]>

    constructor(handoverStatusEntity: Partial<HandoverStatusEntity>) {
        super();
        Object.assign(this, handoverStatusEntity)
    }
}