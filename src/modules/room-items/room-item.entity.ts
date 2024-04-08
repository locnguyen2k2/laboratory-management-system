import { CommonEntity, ExtendedEntity } from "src/common/entity/common.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToOne, Relation } from "typeorm";
import { RoomEntity } from "./../rooms/room.entity";
import { ItemEntity } from "src/modules/items/item.entity";
import { ItemStatusEntity } from "src/modules/item-status/item-status.entity";
import { Length } from "class-validator";

@Entity('room_item_entity')
export class RoomItemEntity extends ExtendedEntity {

    @ManyToOne(() => RoomEntity, room => room.roomItem)
    @JoinColumn({ name: 'room_id' })
    room: Relation<RoomEntity>

    @ManyToOne(() => ItemEntity, item => item.roomItem)
    @JoinColumn({ name: 'item_id' })
    item: Relation<ItemEntity>

    @ManyToOne(() => ItemStatusEntity, itemStatus => itemStatus.roomItem)
    @JoinColumn({ name: 'item_status_id' })
    item_status: Relation<ItemStatusEntity>

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