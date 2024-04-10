import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./../modules/user/user.entity";
import { ConfigModule } from "@nestjs/config";
import { ItemEntity } from "src/modules/items/item.entity";
import { RegistrationEntity } from "src/modules/registration/registration.entity";
import { RoomEntity } from "src/modules/rooms/room.entity";
import { ItemRegistrationEntity } from "src/modules/item-registration/item-registration.entity";
import { CategoryEntity } from "src/modules/categories/category.entity";
import { RoomItemEntity } from "src/modules/room-items/room-item.entity";

const entities = [
    UserEntity,
    CategoryEntity,
    ItemEntity,
    RoomEntity,
    RegistrationEntity,
    ItemRegistrationEntity,
    RoomItemEntity
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