import { ExtendedEntity } from 'src/common/entity/common.entity';
import { Column, Entity, OneToMany, Relation } from 'typeorm';
import { RoomStatus } from './room.constant';
import { RoomItemEntity } from './../room-items/room-item.entity';
import { ItemRegistrationEntity } from '../item-registration/item-registration.entity';

@Entity('room_entity')
export class RoomEntity extends ExtendedEntity {
  @Column()
  name: string;

  @Column({ type: 'varchar', nullable: true })
  remark: string;

  @Column({
    type: 'enum',
    enum: RoomStatus,
    default: RoomStatus.UNAVAILABLE,
    nullable: false,
  })
  status: RoomStatus;

  @Column({ type: 'int', default: 0 })
  quantity: number;

  @OneToMany(() => RoomItemEntity, (roomItem) => roomItem.room)
  roomItem: Relation<RoomItemEntity[]>;

  @OneToMany(
    () => ItemRegistrationEntity,
    (itemRegistration) => itemRegistration.room,
  )
  itemRegistration: Relation<ItemRegistrationEntity[]>;

  constructor(roomEntity: Partial<RoomEntity>) {
    super();
    Object.assign(this, roomEntity);
  }
}
