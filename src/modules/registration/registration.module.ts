import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RegistrationEntity } from "./registration.entity";
import { UserModule } from "../user/user.module";
import { RoleModule } from "../role/role.module";
import { RegistrationService } from "./registration.service";
import { ToolRegistrationModule } from "./tools_registration/tool_registration.module";
import { ChemicalRegistrationModule } from "./chemicals_registration/chemical_registration.module";
import { EquipmentRegistrationModule } from "./equipment_registration/equipment_registration.module";
import { RoomRegistrationModule } from "./room_registration/room_registration.module";
import { EquipmentModule } from "../equipment/equipment.module";
import { RouterModule } from "@nestjs/core";
import { RegistrationController } from "./registration.controller";
import { ToolsModule } from "../tools/tools.module";
import { ChemicalsModule } from "../chemicals/chemicals.module";
import { RoomModule } from "../rooms/room.module";

const modules = [
    ToolRegistrationModule,
    ChemicalRegistrationModule,
    EquipmentRegistrationModule,
    RoomRegistrationModule
]

@Module({
    imports: [
        ...modules,
        TypeOrmModule.forFeature([RegistrationEntity]),
        UserModule,
        RoleModule,
        EquipmentModule,
        ToolsModule,
        ChemicalsModule,
        RoomModule
    ],
    controllers: [RegistrationController],
    providers: [RegistrationService],
    exports: [RegistrationService],
})
export class RegistrationModule { }