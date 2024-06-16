import { ExtendedEntity } from 'src/common/entity/common.entity';
import { UserStatus } from './user.constant';
import { Column, Entity, OneToMany, Relation } from 'typeorm';
import { RegistrationEntity } from '../registration/registration.entity';
import { RoleEnum } from 'src/enums/role-enum.enum';

@Entity({ name: 'user_entity' })
export class UserEntity extends ExtendedEntity {
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ default: null })
  address: string;

  @Column({ default: null })
  photo: string;

  @Column({ unique: true })
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

  @Column({ default: null })
  refresh_token: string;

  @Column({ default: null })
  repass_token: string;

  @OneToMany(() => RegistrationEntity, (registration) => registration.user)
  registration: Relation<RegistrationEntity>;

  constructor(userEntity: Partial<UserEntity>) {
    super();
    Object.assign(this, userEntity);
  }
}
