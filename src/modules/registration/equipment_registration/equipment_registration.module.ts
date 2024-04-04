import { Module } from "@nestjs/common";
import { EquipmentRegistrationController } from "./equipment_registration.controller";
import { EquipmentRegistrationService } from "./equipment_registration.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EquipmentRegistrationEntity } from "./equipment_registration.entity";
import { UserModule } from "src/modules/user/user.module";
import { EquipmentModule } from "src/modules/equipment/equipment.module";

@Module({
    imports: [TypeOrmModule.forFeature([EquipmentRegistrationEntity]), UserModule, EquipmentModule],
    controllers: [EquipmentRegistrationController],
    providers: [EquipmentRegistrationService],
    exports: [EquipmentRegistrationService]
})

export class EquipmentRegistrationModule { }