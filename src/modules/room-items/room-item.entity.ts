import { ExtendedEntity } from 'src/common/entity/common.entity';
import { Column, Entity, JoinColumn, ManyToOne, Relation } from 'typeorm';
import { RoomEntity } from './../rooms/room.entity';
import { ItemEntity } from 'src/modules/items/item.entity';
import { Length } from 'class-validator';

import { ItemStatusEnum } from './../../enums/item-status-enum.enum';

@Entity('room_item_entity')
export class RoomItemEntity extends ExtendedEntity {
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

  @Column()
  quantity: number;

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
