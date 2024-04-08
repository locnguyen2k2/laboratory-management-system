import { Entity, JoinColumn, ManyToOne, OneToMany, Relation } from "typeorm";
import { ExtendedEntity } from "src/common/entity/common.entity";
import { UserEntity } from "../user/user.entity";
import { ItemRegistrationEntity } from "./item_registration/item_registration.entity";

@Entity('registration_entity')
export class RegistrationEntity extends ExtendedEntity {
    @OneToMany(() => ItemRegistrationEntity, itemRegistration => itemRegistration.registration)
    itemRegistration: Relation<ItemRegistrationEntity[]>

    @ManyToOne(() => UserEntity, user => user.registration)
    @JoinColumn({ name: 'user_id' })
    user: Relation<UserEntity>;

    constructor(registrationEntity: Partial<RegistrationEntity>) {
        super();
        Object.assign(this, registrationEntity)
    }
}