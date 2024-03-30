import { CommonEntity } from "src/common/entity/common.entity";
import { CategoryStatusEnum } from "./category-status.enum";
import { Column, Entity, OneToMany } from "typeorm";
import { EquipmentEntity } from "../equipment/equipment.entity";
import { ToolsEntity } from "../tools/tools.entity";
import { ChemicalsEntity } from "../chemicals/chemicals.entity";

@Entity({ name: 'category_entity' })
export class CategoryEntity extends CommonEntity {

    @Column()
    name: string;

    @Column({ type: 'enum', enum: CategoryStatusEnum, default: CategoryStatusEnum.ACTIVE, nullable: false })
    status: CategoryStatusEnum

    // @OneToMany(() => EquipmentEntity, equipment => equipment.category)
    // equipment: EquipmentEntity[];

    // @OneToMany(() => ToolsEntity, tools => tools.category)
    // tools: ToolsEntity[];

    // @OneToMany(() => ChemicalsEntity, chemicals => chemicals.category)
    // chemicals: ChemicalsEntity[];

    constructor(categoryEntity: Partial<CategoryEntity>) {
        super();
        Object.assign(this, categoryEntity)
    }
}