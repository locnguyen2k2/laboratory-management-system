import { Module } from "@nestjs/common";
import { HandoverStatusController } from "./handover_status.controller";
import { HandoverStatusService } from "./handover_status.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { HandoverStatusEntity } from "./handover_status.entity";
import { UserModule } from "../user/user.module";
import { RoleModule } from "../role/role.module";

@Module({
    imports: [TypeOrmModule.forFeature([HandoverStatusEntity]), UserModule, RoleModule],
    controllers: [HandoverStatusController],
    providers: [HandoverStatusService],
    exports: [HandoverStatusService]
})

export class HandoverStatusModule { }