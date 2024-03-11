import { CommonEntity } from "src/common/entity/common.entity";
import { RoleEnum } from "../../common/enums/role.enum";
import { UserStatusEnum } from "../../common/enums/user-status.enum";
import { Column, Entity } from "typeorm";

@Entity({ name: 'user_entity' })
export class UserEntity extends CommonEntity {

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({ unique: true })
    email: string;

    @Column({ default: null })
    phone: string;

    @Column({ default: null })
    address: string;

    @Column({ default: null })
    photo: string;

    @Column({ nullable: true })
    password: string;

    @Column({ type: 'enum', enum: UserStatusEnum, default: UserStatusEnum.UNACTIVE, nullable: false })
    status: UserStatusEnum;

    @Column({ default: null })
    token: string;

    @Column({ default: null })
    refresh_token: string;

    @Column({ default: null })
    repass_token: string;

    @Column({ type: 'enum', enum: RoleEnum, default: RoleEnum.USER, nullable: false })
    role: RoleEnum

    constructor(userEntity: Partial<UserEntity>) {
        super();
        Object.assign(this, userEntity)
    }

}