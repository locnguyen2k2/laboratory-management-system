import { Module } from "@nestjs/common";
import { ItemController } from "./item.controller";
import { ItemService } from "./item.service";
import { UserModule } from "../user/user.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ItemEntity } from "./item.entity";
import { RoleModule } from "../role/role.module";
import { CategoryModule } from "../categories/category.module";
import { UnitModule } from "../units/unit.module";

@Module({
    imports: [TypeOrmModule.forFeature([ItemEntity]), UserModule, RoleModule, CategoryModule, UnitModule],
    controllers: [ItemController],
    providers: [ItemService],
    exports: [ItemService]
})

export class ItemModule { }