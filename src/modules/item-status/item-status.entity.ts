import { CommonEntity } from "src/common/entity/common.entity";
import { Column, Entity, OneToMany, Relation } from "typeorm";
import { RoomItemEntity } from "../room-items/room-item.entity";

@Entity({ name: 'item_status_entity' })
export class ItemStatusEntity extends CommonEntity {

    @Column()
    name: string;

    @OneToMany(() => RoomItemEntity, roomItem => roomItem.item_status)
    roomItem: Relation<RoomItemEntity[]>

    constructor(itemStatusEntity: Partial<ItemStatusEntity>) {
        super();
        Object.assign(this, itemStatusEntity)
    }
}