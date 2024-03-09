import { Module } from "@nestjs/common";
import { DeviceService } from "./device.service";
import { DeviceController } from "./device.controller";

@Module({
    imports: [],
    controllers: [DeviceController],
    providers: [DeviceService]
})

export class DeviceModule { }