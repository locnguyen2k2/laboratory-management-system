import { CommonEntity } from "src/common/entity/common.entity";
import { CategoryStatusEnum } from "./category.constant";
import { Column, Entity, OneToMany, Relation } from "typeorm";
import { EquipmentEntity } from "../equipment/equipment.entity";
import { ToolsEntity } from "../tools/tools.entity";
import { ChemicalsEntity } from "../chemicals/chemicals.entity";
import { RoomEntity } from "../rooms/room.entity";

@Entity({ name: 'category_entity' })
export class CategoryEntity extends CommonEntity {

    @Column()
    name: string;

    @Column({ type: 'enum', enum: CategoryStatusEnum, default: CategoryStatusEnum.ACTIVE, nullable: false })
    status: CategoryStatusEnum

    @OneToMany(() => EquipmentEntity, equipment => equipment.category)
    equipment: Relation<EquipmentEntity[]>;

    @OneToMany(() => ToolsEntity, tools => tools.category)
    tools: Relation<ToolsEntity[]>;

    @OneToMany(() => RoomEntity, room => room.category)
    rooms: Relation<ToolsEntity[]>;

    @OneToMany(() => ChemicalsEntity, chemicals => chemicals.category)
    chemicals: Relation<ChemicalsEntity[]>;

    constructor(categoryEntity: Partial<CategoryEntity>) {
        super();
        Object.assign(this, categoryEntity)
    }
}