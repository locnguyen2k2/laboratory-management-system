import { Expose, Type } from "class-transformer";
import { IsInstance, ValidateNested } from "class-validator";
import { AddEquipmentDto } from "src/modules/equipment/dtos/add-equipment.dto";
import { EquipmentEntity } from "src/modules/equipment/equipment.entity";
import { AddRegistration } from "../../registration.constant";

export class AddEquipmentRegDto {
    @Expose()
    createBy: number
    @Expose()
    updateBy: number
    @Expose()
    quantity: number
}