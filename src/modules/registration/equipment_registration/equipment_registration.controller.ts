import { Controller, Post } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { InjectRepository } from "@nestjs/typeorm";
import { EquipmentRegistrationEntity } from "./equipment_registration.entity";
import { Repository } from "typeorm";

@Controller('equipments')
export class EquipmentRegistrationController {
    constructor(@InjectRepository(EquipmentRegistrationEntity) private readonly equipmentRegistrationRepo: Repository<EquipmentRegistrationEntity>) { }
    @ApiBearerAuth()
    @Post()
    async createEquipmentRegistration() { }
}