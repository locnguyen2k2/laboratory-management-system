import { ExtendedEntity } from 'src/common/entity/common.entity';
import { UserStatus } from './user.constant';
import { Column, Entity, Index, OneToMany, Relation } from 'typeorm';
import { RegistrationEntity } from '../registration/registration.entity';
import { RoleEnum } from 'src/enums/role-enum.enum';
import { ItemReturningEntity } from '../returning/entities/item-returning.entity';

@Entity({ name: 'user_entity' })
export class UserEntity extends ExtendedEntity {
  @Column()
  @Index({ fulltext: true })
  firstName: string;

  @Column()
  @Index({ fulltext: true })
  lastName: string;

  @Column({ default: null })
  @Index({ fulltext: true })
  address: string;

  @Column({ default: null })
  photo: string;

  @Column({ unique: true })
  @Index({ fulltext: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.UNACTIVE,
    nullable: false,
  })
  status: UserStatus;

  @Column({ type: 'enum', enum: RoleEnum, default: RoleEnum.USER })
  role: RoleEnum;

  @Column({ default: null })
  token: string;

  @Column({ default: null, type: 'varchar', length: 600 })
  refresh_token: string;

  @Column({ default: null })
  repass_token: string;

  @OneToMany(() => RegistrationEntity, (registration) => registration.user)
  registration: Relation<RegistrationEntity>;

  @OneToMany(() => ItemReturningEntity, (itemReturning) => itemReturning.user)
  itemReturning: Relation<ItemReturningEntity>;

  constructor(userEntity: Partial<UserEntity>) {
    super();
    Object.assign(this, userEntity);
  }
}
