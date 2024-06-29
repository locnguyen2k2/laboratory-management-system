import { ExtendedEntity } from 'src/common/entity/common.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  Relation,
} from 'typeorm';
import { CategoryEntity } from '../categories/category.entity';
import { RoomItemEntity } from './../room-items/room-item.entity';
import { UnitEnum } from 'src/enums/unit-enum.enum';
import { ItemStatusEnum } from 'src/enums/item-status-enum.enum';

@Entity('item_entity')
export class ItemEntity extends ExtendedEntity {
  @Column()
  name: string;

  @Column()
  origin: string;

  @Column({ nullable: true })
  serial_number: string;

  @Column({ nullable: true })
  volume: number;

  @Column({ type: 'enum', enum: UnitEnum, nullable: true })
  specification: UnitEnum;

  @Column({ type: 'varchar', nullable: true })
  remark: string;

  @Column({ type: 'int', default: 0 })
  quantity: number;

  @Column({ type: 'int', default: 0 })
  handover: number;

  @Column({ type: 'int', default: 0 })
  total_volume: number;

  @Column({ type: 'int', default: 0 })
  remaining_volume: number;

  @Column({ type: 'enum', enum: UnitEnum, nullable: false })
  unit: UnitEnum;

  @Column({ type: 'enum', enum: ItemStatusEnum, nullable: false })
  status: ItemStatusEnum;

  @ManyToOne(() => CategoryEntity, (category) => category.items)
  @JoinColumn({ name: 'category_id' })
  category: Relation<CategoryEntity>;

  @OneToMany(() => RoomItemEntity, (roomItem) => roomItem.item)
  roomItem: Relation<RoomItemEntity[]>;

  constructor(itemEntity: Partial<ItemEntity>) {
    super();
    Object.assign(this, itemEntity);
  }
}
