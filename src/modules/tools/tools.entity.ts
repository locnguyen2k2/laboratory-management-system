import { CommonEntity, ExtendedEntity } from "src/common/entity/common.entity";
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, Relation } from "typeorm";
// import { CategoryEntity } from "../categories/category.entity";
import { ToolStatus } from "./dtos/ToolStatus";
import { RegistrationEntity } from "../registration/registration.entity";

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

    @ManyToMany(() => RegistrationEntity, registration => registration.tools)
    registration: Relation<RegistrationEntity[]>

    // @ManyToOne(() => CategoryEntity, { onDelete: 'CASCADE' })
    // @JoinColumn({ name: "category_id" })
    // category: CategoryEntity;

    constructor(toolsEntity: Partial<ToolsEntity>) {
        super();
        Object.assign(this, toolsEntity)
    }
}