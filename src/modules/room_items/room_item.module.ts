import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RoomItemEntity } from "./room_item.entity";
import { UserModule } from "src/modules/user/user.module";
import { RoomItemController } from "./room_item.controller";
import { RoomItemService } from "./room_item.service";
import { HandoverStatusModule } from "../handover_status/handover_status.module";
import { ItemModule } from "../items/item.module";
import { RoomModule } from "../rooms/room.module";
import { RoleModule } from "../role/role.module";

@Module({
    imports: [TypeOrmModule.forFeature([RoomItemEntity]), 
    UserModule, 
    HandoverStatusModule, 
    ItemModule, 
    RoomModule, 
    RoleModule],
    controllers: [RoomItemController],
    providers: [RoomItemService],
    exports: [RoomItemService]
})
export class RoomItemModule { }