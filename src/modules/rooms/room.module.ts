import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RoomEntity } from "./room.entity";
import { RoomController } from "./room.controller";
import { RoomService } from "./room.service";
import { UserModule } from "../user/user.module";
import { CategoryModule } from "../categories/category.module";
import { RoleModule } from "../role/role.module";

@Module({
    imports: [TypeOrmModule.forFeature([RoomEntity]), UserModule, CategoryModule, RoleModule],
    controllers: [RoomController],
    providers: [RoomService],
    exports: [RoomService]
})

export class RoomModule { }