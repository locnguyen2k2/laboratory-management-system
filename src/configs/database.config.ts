import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./../modules/user/user.entity";
import { ConfigModule } from "@nestjs/config";
import { EquipmentEntity } from "src/modules/equipment/equipment.entity";
import { RoleEntity } from "src/modules/role/role.entity";
import { ToolsEntity } from "src/modules/tools/tools.entity";
import { ChemicalsEntity } from "src/modules/chemicals/chemicals.entity";
import { RegistrationEntity } from "src/modules/registration/registration.entity";
import { RoomEntity } from "src/modules/rooms/room.entity";
import { RoomRegistrationEntity } from "src/modules/registration/room_registration/room_registration.entity";
import { ToolRegistrationEntity } from "src/modules/registration/tools_registration/tool_registration.entity";
import { ChemicalRegistrationEntity } from "src/modules/registration/chemicals_registration/chemical_registration.entity";
import { EquipmentRegistrationEntity } from "src/modules/registration/equipment_registration/equipment_registration.entity";
import { CategoryEntity } from "src/modules/categories/category.entity";

const entities = [
    UserEntity,
    RoleEntity,
    CategoryEntity,
    EquipmentEntity,
    ToolsEntity,
    ChemicalsEntity,
    RoomEntity,
    RegistrationEntity,
    RoomRegistrationEntity,
    ToolRegistrationEntity,
    ChemicalRegistrationEntity,
    EquipmentRegistrationEntity
]

@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: (process.env.DB_HOSTNAME),
            port: +process.env.DB_PORT,
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            entities: [...entities],
            synchronize: true,
        })
    ],
})

export class DatabaseModule { }