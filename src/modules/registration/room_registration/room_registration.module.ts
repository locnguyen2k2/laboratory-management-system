import { Module } from "@nestjs/common";
import { RoomRegistrationController } from "./room_registration.controller";
import { RoomRegistrationService } from "./room_registration.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RoomRegistrationEntity } from "./room_registration.entity";

@Module({
    imports: [TypeOrmModule.forFeature([RoomRegistrationEntity])],
    controllers: [RoomRegistrationController],
    providers: [RoomRegistrationService],
    exports: [RoomRegistrationService]
})

export class RoomRegistrationModule { }