import { Body, Controller, Patch, Post, Request, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ItemRegistrationService } from "./item-registration.service";

@Controller('item-registration')
@ApiTags('Item Registration')
@ApiBearerAuth()
export class ItemRegistrationController {
    constructor(
        private readonly itemBorrowService: ItemRegistrationService
    ) { }
}