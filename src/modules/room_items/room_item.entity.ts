import { CommonEntity, ExtendedEntity } from "src/common/entity/common.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToOne, Relation } from "typeorm";
import { RoomEntity } from "./../rooms/room.entity";
import { ItemEntity } from "src/modules/items/item.entity";
import { HandoverStatusEntity } from "src/modules/handover_status/handover_status.entity";
import { Length } from "class-validator";

@Entity('room_item_entity')
export class RoomItemEntity extends ExtendedEntity {

    @ManyToOne(() => RoomEntity, room => room.roomItem)
    @JoinColumn({ name: 'room_id' })
    room: Relation<RoomEntity>

    @ManyToOne(() => ItemEntity, item => item.roomItem)
    @JoinColumn({ name: 'item_id' })
    item: Relation<ItemEntity>

    @ManyToOne(() => HandoverStatusEntity, handoverStatus => handoverStatus.roomItem)
    @JoinColumn({ name: 'handover_status_id' })
    handover_status: Relation<HandoverStatusEntity>

    @Column()
    quantity: number

    @Column()
    @Length(4)
    year: string

    @Column({ default: null })
    remark: string

    constructor(roomItemEntity: Partial<RoomItemEntity>) {
        super();
        Object.assign(this, roomItemEntity)
    }
}