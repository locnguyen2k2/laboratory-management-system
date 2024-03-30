import { ExtendedEntity } from "src/common/entity/common.entity";
import { Column, Entity, ManyToMany, Relation } from "typeorm";
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

    constructor(toolsEntity: Partial<ToolsEntity>) {
        super();
        Object.assign(this, toolsEntity)
    }
}