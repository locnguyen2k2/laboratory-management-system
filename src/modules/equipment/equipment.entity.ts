import { ExtendedEntity } from "src/common/entity/common.entity";
import { EquipmentStatusEnum } from "./equipment-status.enum";
import { Column, Entity, ManyToMany, Relation } from "typeorm";
import { RegistrationEntity } from "../registration/registration.entity";

@Entity('equipment_entity')
export class EquipmentEntity extends ExtendedEntity {

    @Column()
    name: string;

    @Column()
    quantity: number;

    @Column({ type: 'varchar', nullable: true })
    remark: string;

    @Column({ type: 'enum', enum: EquipmentStatusEnum, default: EquipmentStatusEnum.AVAILABLE, nullable: false })
    status: number;

    @ManyToMany(() => RegistrationEntity, registration => registration.equipment)
    registration: Relation<RegistrationEntity[]>;

    constructor(equipmentEntity: Partial<EquipmentEntity>) {
        super();
        Object.assign(this, equipmentEntity)
    }
}