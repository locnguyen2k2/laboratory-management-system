import { CommonEntity } from "src/common/entity/common.entity";
import { EquipmentStatusEnum } from "src/common/enums/equipment-status.enum";
import { Column, Entity, ManyToOne } from "typeorm";
import { CategoryEntity } from "../categories/category.entity";

@Entity('equipment_entity')
export class EquipmentEntity extends CommonEntity {

    @Column()
    name: string;

    @Column({ type: 'enum', enum: EquipmentStatusEnum, default: EquipmentStatusEnum.AVAILABLE, nullable: false })
    status: number;

    @Column()
    quantity: number;

    @ManyToOne(() => CategoryEntity, category => category.equipment)
    category: CategoryEntity;

    constructor(equipmentEntity: Partial<EquipmentEntity>) {
        super();
        Object.assign(this, equipmentEntity)
    }
}