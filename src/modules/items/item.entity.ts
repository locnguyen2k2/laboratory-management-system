import { ExtendedEntity } from "src/common/entity/common.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, Relation } from "typeorm";
import { ItemRegistrationEntity } from "./../item-registration/item-registration.entity";
import { CategoryEntity } from "../categories/category.entity";
import { RoomItemEntity } from "./../room-items/room-item.entity";
import { UnitEnum } from "src/enums/unit-enum.enum";
import { ItemStatusEnum } from "src/enums/item-status-enum.enum";
import { HandoverStatus } from "src/enums/handover-status-enum.enum";

@Entity('item_entity')
export class ItemEntity extends ExtendedEntity {

    @Column()
    name: string;

    @Column()
    origin: string;

    @Column({ nullable: true })
    serial_number: string;

    @Column({ nullable: true })
    specification: string;

    @Column()
    quantity: number;

    @Column({ type: 'varchar', nullable: true })
    remark: string;

    @Column({ type: 'enum', enum: UnitEnum, nullable: false })
    unit: UnitEnum

    @Column({ type: 'enum', enum: ItemStatusEnum, nullable: false })
    status: ItemStatusEnum

    @Column({ type: 'enum', enum: HandoverStatus, nullable: false, default: HandoverStatus.IsNotHandover })
    handoverStatus: HandoverStatus

    @ManyToOne(() => CategoryEntity, category => category.items)
    @JoinColumn({ name: 'category_id' })
    category: Relation<CategoryEntity>

    @OneToMany(() => ItemRegistrationEntity, itemRegistration => itemRegistration.item)
    itemRegistration: Relation<ItemRegistrationEntity[]>;

    @OneToMany(() => RoomItemEntity, roomItem => roomItem.item)
    roomItem: Relation<RoomItemEntity[]>

    constructor(itemEntity: Partial<ItemEntity>) {
        super();
        Object.assign(this, itemEntity)
    }
}