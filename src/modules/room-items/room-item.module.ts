import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RoomItemEntity } from "./room-item.entity";
import { UserModule } from "src/modules/user/user.module";
import { RoomItemController } from "./room-item.controller";
import { RoomItemService } from "./room-item.service";
import { ItemStatusModule } from "../item-status/item-status.module";
import { ItemModule } from "../items/item.module";
import { RoomModule } from "../rooms/room.module";
import { RoleModule } from "../role/role.module";

@Module({
    imports: [TypeOrmModule.forFeature([RoomItemEntity]),
        UserModule,
        ItemStatusModule,
        ItemModule,
        RoomModule,
        RoleModule],
    controllers: [RoomItemController],
    providers: [RoomItemService],
    exports: [RoomItemService]
})
export class RoomItemModule { }