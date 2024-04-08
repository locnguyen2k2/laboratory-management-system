import { Controller, Post } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { InjectRepository } from "@nestjs/typeorm";
import { ItemRegistrationEntity } from "./item_registration.entity";
import { Repository } from "typeorm";

@Controller('equipments')
export class ItemRegistrationController {
    constructor(@InjectRepository(ItemRegistrationEntity) private readonly itemRegistrationRepo: Repository<ItemRegistrationEntity>) { }
    @ApiBearerAuth()
    @Post()
    async createEquipmentRegistration() { }
}