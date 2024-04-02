import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ScheduleEntity } from "./schedule.entity";
import { ScheduleController } from "./schedule.controller";
import { ScheduleService } from "./schedule.service";

@Module({
    imports: [TypeOrmModule.forFeature([ScheduleEntity])],
    controllers: [ScheduleController],
    providers: [ScheduleService],
    exports: [ScheduleService]
})

export class ScheduleModule { }