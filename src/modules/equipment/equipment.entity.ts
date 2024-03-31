import { ExtendedEntity } from "src/common/entity/common.entity";
import { EquipmentStatusEnum } from "./equipment-status.enum";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, Relation } from "typeorm";
import { EquipmentRegistrationEntity } from "./../registration/equipment_registration/equipment_registration.entity";
import { CategoryEntity } from "../categories/category.entity";

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

    @OneToMany(() => EquipmentRegistrationEntity, equipmentRegistration => equipmentRegistration.equipment)
    equipmentRegistration: Relation<EquipmentRegistrationEntity[]>;

    @ManyToOne(() => CategoryEntity, category => category.equipment)
    @JoinColumn({ name: 'category_id' })
    category: Relation<CategoryEntity>

    constructor(equipmentEntity: Partial<EquipmentEntity>) {
        super();
        Object.assign(this, equipmentEntity)
    }
}