import { ExtendedEntity } from "src/common/entity/common.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, Relation } from "typeorm";
import { ToolStatus } from "./tools.constant";
import { ToolRegistrationEntity } from "./../registration/tools_registration/tool_registration.entity";
import { CategoryEntity } from "../categories/category.entity";

@Entity({ name: "tools_entity" })
export class ToolsEntity extends ExtendedEntity {

    @Column()
    name: string;

    @Column()
    quantity: number;

    @Column({ type: 'varchar', nullable: true })
    remark: string;

    @Column({ type: 'enum', enum: ToolStatus, default: ToolStatus.AVAILABLE, nullable: false })
    status: number;

    @OneToMany(() => ToolRegistrationEntity, toolRegistration => toolRegistration.tool)
    toolRegistration: Relation<ToolRegistrationEntity[]>

    @ManyToOne(() => CategoryEntity, category => category.tools)
    @JoinColumn({ name: 'category_id' })
    category: Relation<CategoryEntity>

    constructor(toolsEntity: Partial<ToolsEntity>) {
        super();
        Object.assign(this, toolsEntity)
    }
}