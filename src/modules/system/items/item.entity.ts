import { ExtendedEntity } from "src/common/entity/common.entity";
import { CategoryEntity } from "src/modules/categories/category.entity";
import { Column, Entity, JoinTable, ManyToOne } from "typeorm";

@Entity({ name: 'item_entity' })
export class ItemEntity extends ExtendedEntity {
    @ManyToOne(() => CategoryEntity, { onDelete: 'CASCADE' })
    @JoinTable({ name: 'category_id' })
    category: CategoryEntity

    @Column({ type: 'varchar', nullable: false })
    name: string;

    @Column({ type: 'varchar', nullable: true })
    remark: string;
}