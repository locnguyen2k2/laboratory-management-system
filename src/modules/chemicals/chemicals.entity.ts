import { CommonEntity } from "src/common/entity/common.entity";
import { Column, Entity, ManyToOne } from "typeorm";
import { CategoryEntity } from "../categories/category.entity";

@Entity({ name: "chemicals_entity" })
export class ChemicalsEntity extends CommonEntity {
    @Column()
    name: string;

    @ManyToOne(() => CategoryEntity, category => category.chemicals)
    category: CategoryEntity;

    constructor(chemicalsEntity: Partial<ChemicalsEntity>) {
        super();
        Object.assign(this, chemicalsEntity)
    }
}