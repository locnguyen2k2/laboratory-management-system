import { ExtendedEntity } from "src/common/entity/common.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, Relation } from "typeorm";
import { ChemicalStatus } from "./dtos/chemical-status.enum";
import { ChemicalRegistrationEntity } from "./../registration/chemicals_registration/chemical_registration.entity";
import { CategoryEntity } from "../categories/category.entity";

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

    @OneToMany(() => ChemicalRegistrationEntity, chemicalRegistration => chemicalRegistration.chemical)
    chemicalRegistration: Relation<ChemicalRegistrationEntity[]>

    @ManyToOne(() => CategoryEntity, category => category.chemicals)
    @JoinColumn({ name: 'category_id' })
    category: Relation<CategoryEntity>

    constructor(chemicalsEntity: Partial<ChemicalsEntity>) {
        super();
        Object.assign(this, chemicalsEntity)
    }
}