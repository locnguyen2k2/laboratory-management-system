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

const entities = [
    UserEntity,
    RoleEntity,
    EquipmentEntity,
    ToolsEntity,
    ChemicalsEntity,
    RoomEntity,
    RegistrationEntity
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