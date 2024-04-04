import { Module } from "@nestjs/common";
import { RoomRegistrationController } from "./room_registration.controller";
import { RoomRegistrationService } from "./room_registration.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RoomRegistrationEntity } from "./room_registration.entity";
import { RoomModule } from "src/modules/rooms/room.module";
import { ScheduleModule } from "src/modules/schedules/schedule.module";

@Module({
    imports: [TypeOrmModule.forFeature([RoomRegistrationEntity]), RoomModule, ScheduleModule],
    controllers: [RoomRegistrationController],
    providers: [RoomRegistrationService],
    exports: [RoomRegistrationService]
})

export class RoomRegistrationModule { }