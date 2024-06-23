import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  Relation,
} from 'typeorm';
import { ExtendedEntity } from 'src/common/entity/common.entity';
import { UserEntity } from '../user/user.entity';
import { ItemRegistrationEntity } from './../item-registration/item-registration.entity';
import { RegistrationStatusEnum } from './registration.constant';
import { ItemReturningEntity } from '../returning/entities/item-returning.entity';

@Entity('registration_entity')
export class RegistrationEntity extends ExtendedEntity {
  @OneToMany(
    () => ItemRegistrationEntity,
    (itemRegistration) => itemRegistration.registration,
  )
  itemRegistration: Relation<ItemRegistrationEntity[]>;

  @OneToMany(
    () => ItemReturningEntity,
    (itemReturning) => itemReturning.registration,
  )
  itemReturning: Relation<ItemReturningEntity[]>;

  @ManyToOne(() => UserEntity, (user) => user.registration)
  @JoinColumn({ name: 'user_id' })
  user: Relation<UserEntity>;

  @Column({
    type: 'enum',
    enum: RegistrationStatusEnum,
    default: RegistrationStatusEnum.PENDING,
  })
  status: RegistrationStatusEnum;

  constructor(registrationEntity: Partial<RegistrationEntity>) {
    super();
    Object.assign(this, registrationEntity);
  }
}
