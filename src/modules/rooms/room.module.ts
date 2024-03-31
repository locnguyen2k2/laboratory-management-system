import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RoomEntity } from "./room.entity";
import { RoomController } from "./room.controller";
import { RoomService } from "./room.service";

@Module({
    imports: [TypeOrmModule.forFeature([RoomEntity])],
    controllers: [RoomController],
    providers: [RoomService],
    exports: [RoomService]
})

export class RoomModule{}