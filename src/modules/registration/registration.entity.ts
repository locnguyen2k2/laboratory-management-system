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

@Entity('registration_entity')
export class RegistrationEntity extends ExtendedEntity {
  @OneToMany(
    () => ItemRegistrationEntity,
    (itemRegistration) => itemRegistration.registration,
  )
  itemRegistration: Relation<ItemRegistrationEntity[]>;

  @ManyToOne(() => UserEntity, (user) => user.registration)
  @JoinColumn({ name: 'user_id' })
  user: Relation<UserEntity>;

  @Column({
    type: 'enum',
    enum: RegistrationStatusEnum,
    default: RegistrationStatusEnum.BORROWING,
  })
  status: RegistrationStatusEnum;

  constructor(registrationEntity: Partial<RegistrationEntity>) {
    super();
    Object.assign(this, registrationEntity);
  }
}
