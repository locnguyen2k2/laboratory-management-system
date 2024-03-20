import { CommonEntity } from "src/common/entity/common.entity";
import { Column, Entity, ManyToOne } from "typeorm";
import { CategoryEntity } from "../categories/category.entity";

@Entity({ name: "tools_entity" })
export class ToolsEntity extends CommonEntity {
    @Column()
    name: string;

    @ManyToOne(() => CategoryEntity, category => category.tools)
    category: CategoryEntity;

    constructor(toolsEntity: Partial<ToolsEntity>) {
        super();
        Object.assign(this, toolsEntity)
    }
}