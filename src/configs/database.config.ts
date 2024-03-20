import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./../modules/user/user.entity";
import { ConfigModule } from "@nestjs/config";
import { CategoryEntity } from "src/modules/categories/category.entity";
import { EquipmentEntity } from "src/modules/equipment/equipment.entity";
import { ImageEntity } from "src/modules/images/image.entity";
import { ToolsEntity } from "src/modules/tools/tools.entity";
import { ChemicalsEntity } from "src/modules/chemicals/chemicals.entity";

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
            entities: [UserEntity, CategoryEntity, EquipmentEntity, ImageEntity, ToolsEntity, ChemicalsEntity],
            synchronize: true,
        })
    ],
})

export class DatabaseModule { }