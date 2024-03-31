import { ExtendedEntity } from "src/common/entity/common.entity";
import { Column, Entity, JoinColumn, ManyToOne, Relation } from "typeorm";
import { RegistrationEntity } from "./../registration.entity";
import { ToolsEntity } from "./../../tools/tools.entity";

@Entity('tool_registration_entity')
export class ToolRegistrationEntity extends ExtendedEntity {
    @ManyToOne(() => RegistrationEntity, registration => registration.toolRegistration)
    @JoinColumn({ name: 'registration_id' })
    registration: Relation<RegistrationEntity>;

    @ManyToOne(() => ToolsEntity, tool => tool.toolRegistration)
    @JoinColumn({ name: 'tool_id' })
    tool: Relation<ToolsEntity>;

    @Column()
    quantity: number;

    constructor(toolRegistrationEntity: Partial<ToolRegistrationEntity>) {
        super();
        Object.assign(this, toolRegistrationEntity)
    }
}