import { ExtendedEntity } from "src/common/entity/common.entity";
import { Column, Entity, ManyToMany, Relation } from "typeorm";
import { RegistrationEntity } from "../registration/registration.entity";

@Entity('room_entity')
export class RoomEntity extends ExtendedEntity {
    @Column()
    name: string;

    @ManyToMany(() => RegistrationEntity, registration => registration.rooms)
    registration: Relation<RegistrationEntity[]>
}