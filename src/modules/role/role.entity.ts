import { IsNotEmpty, IsNumber, IsString, Validate } from "class-validator";
import { IsValidString } from "src/common/decorators/string-validation.decorator";
import { CommonEntity } from "src/common/entity/common.entity";
import { UserEntity } from "src/modules/user/user.entity";
import { Column, Entity, ManyToMany, Relation } from "typeorm";
import { RoleStatus } from "./role.constant";

@Entity("role_entity")
export class RoleEntity extends CommonEntity {
    @Column({ unique: true })
    name: string;

    @Column()
    value: string;

    @Column({ type: 'enum', enum: RoleStatus, default: RoleStatus.ENABLE, nullable: true })
    status: number;

    @ManyToMany(() => UserEntity, user => user.roles)
    users: Relation<UserEntity[]>;

    constructor(roleEntity: Partial<RoleEntity>) {
        super();
        Object.assign(this, roleEntity)
    }
}