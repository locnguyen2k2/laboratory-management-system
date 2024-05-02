import { ExtendedEntity } from "src/common/entity/common.entity";
import { Column, Entity, JoinColumn, ManyToOne, Relation } from "typeorm";
import { RegistrationEntity } from "./../registration/registration.entity";
import { ItemEntity } from "./../items/item.entity";
import { RoomEntity } from "../rooms/room.entity";
import { ItemStatusEnum } from "src/enums/item-status-enum.enum";

@Entity('item_registration_entity')
export class ItemRegistrationEntity extends ExtendedEntity {
    @ManyToOne(() => RegistrationEntity, registration => registration.itemRegistration)
    @JoinColumn({ name: 'registration_id' })
    registration: Relation<RegistrationEntity>;

    @ManyToOne(() => ItemEntity, item => item.itemRegistration)
    @JoinColumn({ name: 'item_id' })
    item: Relation<ItemEntity>;

    @ManyToOne(() => RoomEntity, room => room.itemRegistration)
    @JoinColumn({ name: 'room_id' })
    room: Relation<RoomEntity>;

    @Column({ type: 'enum', enum: ItemStatusEnum, default: ItemStatusEnum.STILLINGOODUSE })
    status: ItemStatusEnum

    @Column() 
    quantity: number

    @Column({ type: 'varchar' })
    start_day: number

    @Column({ type: 'varchar' })
    end_day: number

    constructor(itemRegistrationEntity: Partial<ItemRegistrationEntity>) {
        super();
        Object.assign(this, itemRegistrationEntity)
    }
}