import { CommonEntity } from "src/common/entity/common.entity";
import { UserRole } from "./user.constant";
import { UserStatus } from "./user.constant";
import { Column, Entity, JoinTable, ManyToMany, Relation } from "typeorm";
import { RoleEntity } from "../role/role.entity";

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

    @Column({ type: 'enum', enum: UserStatus, default: UserStatus.UNACTIVE, nullable: false })
    status: UserStatus;

    @Column({ default: null })
    token: string;

    @Column({ default: null })
    refresh_token: string;

    @Column({ default: null })
    repass_token: string;

    @ManyToMany(() => RoleEntity, role => role.users)
    @JoinTable({
        name: 'user_roles',
        joinColumn: { name: 'user_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
    })
    roles: Relation<RoleEntity[]>;

    constructor(userEntity: Partial<UserEntity>) {
        super();
        Object.assign(this, userEntity)
    }

}