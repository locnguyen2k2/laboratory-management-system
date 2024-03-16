import { CommonEntity } from "src/common/entity/common.entity";
import { DeviceStatusEnum } from "src/common/enums/device-status.enum";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, Relation } from "typeorm";
import { CategoryEntity } from "../categories/category.entity";

@Entity('device_entity')
export class DeviceEntity extends CommonEntity {

    @Column()
    name: string;

    @Column({ type: 'enum', enum: DeviceStatusEnum, default: DeviceStatusEnum.AVAILABLE, nullable: false })
    status: number;

    @Column()
    quantity: number;

    @ManyToOne(() => CategoryEntity, category => category.devices)
    category: CategoryEntity

    constructor(deviceEntity: Partial<DeviceEntity>) {
        super();
        Object.assign(this, deviceEntity)
    }
}