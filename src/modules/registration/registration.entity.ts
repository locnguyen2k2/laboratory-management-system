import { Column, Entity, JoinColumn, ManyToOne, OneToMany, Relation } from "typeorm";
import { ExtendedEntity } from "src/common/entity/common.entity";
import { UserEntity } from "../user/user.entity";
import { EquipmentRegistrationEntity } from "./equipment_registration/equipment_registration.entity";
import { ToolRegistrationEntity } from "./tools_registration/tool_registration.entity";
import { ChemicalRegistrationEntity } from "./chemicals_registration/chemical_registration.entity";
import { RoomRegistrationEntity } from "./room_registration/room_registration.entity";

@Entity('registration_entity')
export class RegistrationEntity extends ExtendedEntity {
    @OneToMany(() => EquipmentRegistrationEntity, equipmentRegistration => equipmentRegistration.registration)
    equipmentRegistration: Relation<EquipmentRegistrationEntity[]>

    @OneToMany(() => ToolRegistrationEntity, toolRegistration => toolRegistration.registration)
    toolRegistration: Relation<ToolRegistrationEntity[]>

    @OneToMany(() => ChemicalRegistrationEntity, chemicalRegistration => chemicalRegistration.registration)
    chemicalRegistration: Relation<ChemicalRegistrationEntity[]>

    @OneToMany(() => RoomRegistrationEntity, roomRegistration => roomRegistration.registration)
    roomRegistration: Relation<RoomRegistrationEntity[]>

    @Column({ type: 'datetime' })
    from: Date

    @Column({ type: 'datetime' })
    to: Date

    @ManyToOne(() => UserEntity, user => user.registration)
    @JoinColumn({ name: 'user_id' })
    user: Relation<UserEntity>;

    constructor(registrationEntity: Partial<RegistrationEntity>) {
        super();
        Object.assign(this, registrationEntity)
    }
}