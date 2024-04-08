import { CommonEntity } from "src/common/entity/common.entity";
import { UnitEnum, UnitStatus } from "./unit.constant";
import { Column, Entity, OneToMany, Relation } from "typeorm";
import { ItemEntity } from "../items/item.entity";

@Entity({ name: 'unit_entity' })
export class UnitEntity extends CommonEntity {

    @Column()
    name: string;

    @Column({ type: 'enum', enum: UnitStatus, default: UnitStatus.ACTIVE, nullable: false })
    status: UnitStatus

    @OneToMany(() => ItemEntity, item => item.unit)
    items: Relation<ItemEntity[]>;

    constructor(unitEntity: Partial<UnitEntity>) {
        super();
        Object.assign(this, unitEntity)
    }
}