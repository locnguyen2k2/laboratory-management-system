import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ScheduleEntity } from "./schedule.entity";
import { ScheduleController } from "./schedule.controller";
import { ScheduleService } from "./schedule.service";
import { RoleModule } from "../role/role.module";
import { UserModule } from "../user/user.module";

@Module({
    imports: [TypeOrmModule.forFeature([ScheduleEntity]), UserModule, RoleModule],
    controllers: [ScheduleController],
    providers: [ScheduleService],
    exports: [ScheduleService]
})

export class ScheduleModule { }