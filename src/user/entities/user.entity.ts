import { RoleEnum } from "src/auth/enums/role.enum";
import { UserStatusEnum } from "src/auth/enums/user-status.enum";
import { Column, Entity, IsNull, PrimaryGeneratedColumn, } from "typeorm";

@Entity()
export class UserEntity {

    @PrimaryGeneratedColumn()
    id: number;

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

    @Column({ nullable: true })
    password: string;

    @Column({ default: () => "CURRENT_TIMESTAMP" })
    created_at: Date;

    @Column({ default: () => "CURRENT_TIMESTAMP" })
    updated_at: Date;

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
        Object.assign(this, userEntity)
    }

}