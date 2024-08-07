import { ExtendedEntity } from 'src/common/entity/common.entity';
import { Column, Entity, JoinColumn, ManyToOne, Relation } from 'typeorm';
import { ItemStatusEnum } from 'src/enums/item-status-enum.enum';
import { ItemRegistrationEntity } from '../../item-registration/item-registration.entity';
import { BaseStatusEnum } from '../../../enums/base-status.enum';
import { UserEntity } from '../../user/user.entity';
import { RegistrationEntity } from '../../registration/registration.entity';

@Entity('item_returning_entity')
export class ItemReturningEntity extends ExtendedEntity {
  @ManyToOne(
    () => RegistrationEntity,
    (registration) => registration.itemReturning,
  )
  @JoinColumn({ name: 'registration_id' })
  registration: Relation<RegistrationEntity>;

  @ManyToOne(
    () => ItemRegistrationEntity,
    (itemRegistration) => itemRegistration.itemReturning,
  )
  @JoinColumn({ name: 'item_registration_id' })
  itemRegistration: Relation<ItemRegistrationEntity>;

  @Column({ default: null, type: 'int' })
  remaining_volume: number;

  @ManyToOne(() => UserEntity, (user) => user.itemReturning)
  @JoinColumn()
  user: Relation<UserEntity>;

  @Column({
    type: 'enum',
    enum: ItemStatusEnum,
    default: ItemStatusEnum.STILLINGOODUSE,
  })
  itemStatus: ItemStatusEnum;

  @Column({
    type: 'enum',
    enum: BaseStatusEnum,
    default: BaseStatusEnum.UNMANAGED,
  })
  status: BaseStatusEnum;

  @Column()
  quantity: number;

  @Column({ type: 'varchar' })
  date_returning: number;

  @Column({ type: 'varchar', nullable: true })
  remark: string;

  constructor(itemReturningEntity: Partial<ItemReturningEntity>) {
    super();
    Object.assign(this, itemReturningEntity);
  }
}
