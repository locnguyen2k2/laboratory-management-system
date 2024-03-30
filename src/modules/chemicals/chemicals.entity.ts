import { CommonEntity, ExtendedEntity } from "src/common/entity/common.entity";
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, Relation } from "typeorm";
// import { CategoryEntity } from "../categories/category.entity";
import { ChemicalStatus } from "./dtos/chemical-status.enum";
import { RegistrationEntity } from "../registration/registration.entity";

@Entity({ name: "chemicals_entity" })
export class ChemicalsEntity extends ExtendedEntity {

    @Column()
    name: string;

    @Column()
    quantity: number;

    @Column({ type: 'varchar', nullable: true })
    remark: string;

    @Column({ type: 'enum', enum: ChemicalStatus, default: ChemicalStatus.AVAILABLE, nullable: false })
    status: number;

    @ManyToMany(() => RegistrationEntity, registration => registration.chemicals)
    registration: Relation<RegistrationEntity[]>
    // @ManyToOne(() => CategoryEntity, { onDelete: 'CASCADE' })
    // @JoinColumn({ name: "category_id" })
    // category: CategoryEntity;

    constructor(chemicalsEntity: Partial<ChemicalsEntity>) {
        super();
        Object.assign(this, chemicalsEntity)
    }
}