import { ExtendedEntity } from 'src/common/entity/common.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  Relation,
} from 'typeorm';
import { RoomEntity } from './../rooms/room.entity';
import { ItemEntity } from 'src/modules/items/item.entity';
import { Length } from 'class-validator';

import { ItemStatusEnum } from './../../enums/item-status-enum.enum';
import { ItemRegistrationEntity } from '../item-registration/item-registration.entity';

@Entity('room_item_entity')
export class RoomItemEntity extends ExtendedEntity {
  @OneToMany(
    () => ItemRegistrationEntity,
    (itemRegistration) => itemRegistration.roomItem,
  )
  itemRegistration: Relation<ItemRegistrationEntity[]>;

  @ManyToOne(() => RoomEntity, (room) => room.roomItem)
  @JoinColumn({ name: 'room_id' })
  room: Relation<RoomEntity>;

  @ManyToOne(() => ItemEntity, (item) => item.roomItem)
  @JoinColumn({ name: 'item_id' })
  item: Relation<ItemEntity>;

  @Column({
    type: 'enum',
    enum: ItemStatusEnum,
    default: ItemStatusEnum.NORMALOPERATION,
  })
  status: ItemStatusEnum;

  @Column({ type: 'int', default: 0 })
  quantity: number;

  @Column({ type: 'int', default: 0 })
  itemQuantityBorrowed: number;

  @Column({ type: 'int', default: 0 })
  itemQuantityReturned: number;

  @Column()
  @Length(4)
  year: string;

  @Column({ default: null })
  remark: string;

  constructor(roomItemEntity: Partial<RoomItemEntity>) {
    super();
    Object.assign(this, roomItemEntity);
  }
}
