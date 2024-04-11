import { Module } from "@nestjs/common";
import { ItemRegistrationController } from "./item-registration.controller";
import { ItemRegistrationService } from "./item-registration.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ItemRegistrationEntity } from "./item-registration.entity";
import { UserModule } from "src/modules/user/user.module";
import { ItemModule } from "src/modules/items/item.module";

@Module({
    imports: [TypeOrmModule.forFeature([ItemRegistrationEntity]), UserModule, ItemModule],
    controllers: [ItemRegistrationController],
    providers: [ItemRegistrationService],
    exports: [ItemRegistrationService]
})

export class ItemRegistrationModule { }