import { Column, Entity, JoinTable, ManyToMany, Relation } from "typeorm";
import { EquipmentEntity } from "../equipment/equipment.entity";
import { ExtendedEntity } from "src/common/entity/common.entity";
import { ToolsEntity } from "../tools/tools.entity";
import { ChemicalsEntity } from "../chemicals/chemicals.entity";
import { RoomEntity } from "../rooms/room.entity";

@Entity('registration_entity')
export class RegistrationEntity extends ExtendedEntity {
    @ManyToMany(() => EquipmentEntity, equipment => equipment.registration)
    @JoinTable({
        name: 'equipment_registration',
        joinColumn: { name: 'registration_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'equipment_id', referencedColumnName: 'id' },
    })
    equipment: Relation<EquipmentEntity[]>
    @ManyToMany(() => ToolsEntity, tool => tool.registration)
    @JoinTable({
        name: 'tool_registration',
        joinColumn: { name: 'registration_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'tool_id', referencedColumnName: 'id' },
    })
    tools: Relation<ToolsEntity[]>;
    @ManyToMany(() => ChemicalsEntity, chemical => chemical.registration)
    @JoinTable({
        name: 'chemical_registration',
        joinColumn: { name: 'registration_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'chemical_id', referencedColumnName: 'id' },
    })
    chemicals: Relation<ChemicalsEntity[]>;
    @ManyToMany(() => RoomEntity, room => room.registration)
    @JoinTable({
        name: 'room_registration',
        joinColumn: { name: 'registration_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'room_id', referencedColumnName: 'id' },
    })
    rooms: Relation<RoomEntity[]>; 
}