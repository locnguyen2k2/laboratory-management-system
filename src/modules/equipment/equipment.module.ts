import { Module } from "@nestjs/common";
import { EquipmentController } from "./equipment.controller";
import { EquipmentService } from "./equipment.service";
import { UserModule } from "../user/user.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EquipmentEntity } from "./equipment.entity";
import { RoleModule } from "../role/role.module";
import { CategoryModule } from "../categories/category.module";

@Module({
    imports: [TypeOrmModule.forFeature([EquipmentEntity]), UserModule, RoleModule, CategoryModule],
    controllers: [EquipmentController],
    providers: [EquipmentService],
    exports: [EquipmentService]
})

export class EquipmentModule { }