import { ExtendedEntity } from "src/common/entity/common.entity";
import { Column, Entity, JoinColumn, ManyToOne, Relation } from "typeorm";
import { RegistrationEntity } from "./../registration.entity";
import { ChemicalsEntity } from "./../../chemicals/chemicals.entity";

@Entity('chemical_registration_entity')
export class ChemicalRegistrationEntity extends ExtendedEntity {
    @ManyToOne(() => RegistrationEntity, registration => registration.chemicalRegistration)
    @JoinColumn({ name: 'registration_id' })
    registration: Relation<RegistrationEntity>;

    @ManyToOne(() => ChemicalsEntity, chemical => chemical.chemicalRegistration)
    @JoinColumn({ name: 'chemical_id' })
    chemical: Relation<ChemicalsEntity>;

    @Column()
    quantity: number;

    constructor(chemicalEntity: Partial<ChemicalRegistrationEntity>) {
        super();
        Object.assign(this, chemicalEntity)
    }
}