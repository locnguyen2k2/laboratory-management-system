import { ExtendedEntity } from "src/common/entity/common.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, Relation } from "typeorm";
import { ItemRegistrationEntity } from "./../item-registration/item-registration.entity";
import { CategoryEntity } from "../categories/category.entity";
import { UnitEntity } from "../units/unit.entity";
import { RoomItemEntity } from "./../room-items/room-item.entity";

@Entity('item_entity')
export class ItemEntity extends ExtendedEntity {

    @Column()
    name: string;

    @Column()
    origin: string;

    @Column()
    specification: string;

    @Column()
    quantity: number;

    @Column({ type: 'varchar', nullable: true })
    remark: string;

    @ManyToOne(() => UnitEntity, unit => unit.items)
    @JoinColumn({ name: 'unit_id' })
    unit: Relation<UnitEntity>

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