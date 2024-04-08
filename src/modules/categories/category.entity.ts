import { CommonEntity } from "src/common/entity/common.entity";
import { CategoryStatusEnum } from "./category.constant";
import { Column, Entity, OneToMany, Relation } from "typeorm";
import { ItemEntity } from "../items/item.entity";
import { RoomEntity } from "../rooms/room.entity";

@Entity({ name: 'category_entity' })
export class CategoryEntity extends CommonEntity {

    @Column()
    name: string;

    @Column({ type: 'enum', enum: CategoryStatusEnum, default: CategoryStatusEnum.ACTIVE, nullable: false })
    status: CategoryStatusEnum

    @OneToMany(() => ItemEntity, item => item.category)
    items: Relation<ItemEntity[]>;

    constructor(categoryEntity: Partial<CategoryEntity>) {
        super();
        Object.assign(this, categoryEntity)
    }
}