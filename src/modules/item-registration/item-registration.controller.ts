import { Controller, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { InjectRepository } from "@nestjs/typeorm";
import { ItemRegistrationEntity } from "./item-registration.entity";
import { Repository } from "typeorm";

@Controller('item-registration')
@ApiTags('Item Registration')
@ApiBearerAuth()
export class ItemRegistrationController {
    constructor(@InjectRepository(ItemRegistrationEntity) private readonly itemRegistrationRepo: Repository<ItemRegistrationEntity>) { }
}