import { Module } from "@nestjs/common";
import { EquipmentController } from "./equipment.controller";
import { EquipmentService } from "./equipment.service";
import { UserModule } from "../user/user.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EquipmentEntity } from "./equipment.entity";
import { RoleModule } from "../role/role.module";

@Module({
    imports: [TypeOrmModule.forFeature([EquipmentEntity]), UserModule, RoleModule],
    controllers: [EquipmentController],
    providers: [EquipmentService]
})

export class EquipmentModule { }