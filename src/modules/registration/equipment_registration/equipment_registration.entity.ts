import { ExtendedEntity } from "src/common/entity/common.entity";
import { Column, Entity, JoinColumn, ManyToOne, Relation } from "typeorm";
import { RegistrationEntity } from "../registration.entity";
import { EquipmentEntity } from "./../../equipment/equipment.entity";

@Entity('equipment_registration_entity')
export class EquipmentRegistrationEntity extends ExtendedEntity {
    @ManyToOne(() => RegistrationEntity, registration => registration.equipmentRegistration)
    @JoinColumn({ name: 'registration_id' })
    registration: Relation<RegistrationEntity>;

    @ManyToOne(() => EquipmentEntity, equipment => equipment.equipmentRegistration)
    @JoinColumn({ name: 'equipment_id' })
    equipment: Relation<EquipmentEntity>;

    @Column()
    quantity: number;
    constructor(equipmentRegistrationEntity: Partial<EquipmentRegistrationEntity>) {
        super();
        Object.assign(this, equipmentRegistrationEntity)
    }
}