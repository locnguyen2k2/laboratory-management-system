import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RoomEntity } from "./room.entity";
import { RoomController } from "./room.controller";
import { RoomService } from "./room.service";
import { UserModule } from "../user/user.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([RoomEntity]),
        UserModule,
    ],
    controllers: [RoomController],
    providers: [RoomService],
    exports: [RoomService]
})

export class RoomModule { }