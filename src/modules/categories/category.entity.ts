import { CommonEntity } from "src/common/entity/common.entity";
import { CategoryStatusEnum } from "src/common/enums/category-status.enum";
import { Column, Entity, OneToMany, Relation } from "typeorm";
import { DeviceEntity } from "../devices/device.entity";

@Entity({ name: 'category_entity' })
export class CategoryEntity extends CommonEntity {

    @Column()
    name: string;

    @Column({ type: 'enum', enum: CategoryStatusEnum, default: CategoryStatusEnum.ACTIVE, nullable: false })
    status: CategoryStatusEnum

    @OneToMany(() => DeviceEntity, device => device.category)
    devices: DeviceEntity[];

    constructor(categoryEntity: Partial<CategoryEntity>) {
        super();
        Object.assign(this, categoryEntity)
    }
}