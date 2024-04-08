import { Module } from "@nestjs/common";
import { ItemStatusController } from "./item-status.controller";
import { ItemStatusService } from "./item-status.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ItemStatusEntity } from "./item-status.entity";
import { UserModule } from "../user/user.module";
import { RoleModule } from "../role/role.module";

@Module({
    imports: [TypeOrmModule.forFeature([ItemStatusEntity]), UserModule, RoleModule],
    controllers: [ItemStatusController],
    providers: [ItemStatusService],
    exports: [ItemStatusService]
})

export class ItemStatusModule { }