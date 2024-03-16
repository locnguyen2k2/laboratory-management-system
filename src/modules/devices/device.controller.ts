import { Body, Controller, Patch, Post, UseGuards, Get } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { JwtGuard } from "../auth/guard/jwt-auth.guard";
import { RolesGuard } from "../auth/guard/roles-auth.guard";
import { Roles } from "src/common/decorators/roles.decorator";
import { RoleEnum } from "src/common/enums/role.enum";
import { AddDeviceDto } from "./dtos/add-device.dto";
import { plainToClass } from "class-transformer";
import { DeviceService } from "./device.service";
import { IdParam } from "src/common/decorators/id-param.decorator";
import { UpdateDeviceDto } from "./dtos/update-device.dto";

@Controller('devices')
export class DeviceController {
    constructor(
        private readonly deviceService: DeviceService
    ) { }

    @ApiBearerAuth()
    @Get()
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(RoleEnum.ADMIN)
    async get() {
        return await this.deviceService.findAll();
    }

    @ApiBearerAuth()
    @Post()
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(RoleEnum.ADMIN)
    async add(@Body() dto: AddDeviceDto) {
        const data = plainToClass(AddDeviceDto, dto, { excludeExtraneousValues: true });
        return await this.deviceService.add(data);
    }

    @ApiBearerAuth()
    @Patch('/:id')
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(RoleEnum.ADMIN)
    async update(@IdParam() id: number, @Body() dto: UpdateDeviceDto) {
        const data = plainToClass(UpdateDeviceDto, dto, { excludeExtraneousValues: true });
        return await this.deviceService.update(id, data);
    }

    @Get('/:id')
    async getDevice(@IdParam() id: number) {
        return await this.deviceService.findById(id);
    }
}