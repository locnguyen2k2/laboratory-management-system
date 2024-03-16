import { Module } from "@nestjs/common";
import { DeviceController } from "./device.controller";
import { DeviceService } from "./device.service";
import { UserModule } from "../user/user.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DeviceEntity } from "./device.entity";
import { CategoryModule } from "../categories/category.module";

@Module({
    imports: [TypeOrmModule.forFeature([DeviceEntity]), UserModule, CategoryModule],
    controllers: [DeviceController],
    providers: [DeviceService]
})

export class DeviceModule { }