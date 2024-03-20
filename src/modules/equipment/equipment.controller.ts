import { Body, Controller, Patch, Post, UseGuards, Get } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { JwtGuard } from "../auth/guard/jwt-auth.guard";
import { RolesGuard } from "../auth/guard/roles-auth.guard";
import { Roles } from "src/common/decorators/roles.decorator";
import { RoleEnum } from "src/common/enums/role.enum";
import { AddEquipmentDto } from "./dtos/add-equipment.dto";
import { plainToClass } from "class-transformer";
import { EquipmentService } from "./equipment.service";
import { IdParam } from "src/common/decorators/id-param.decorator";
import { UpdateEquipmentDto } from "./dtos/update-equipment.dto";

@Controller('equipment')
export class EquipmentController {
    constructor(
        private readonly equipmentService: EquipmentService
    ) { }

    @ApiBearerAuth()
    @Get()
    async get() {
        return await this.equipmentService.findAll();
    }

    @ApiBearerAuth()
    @Post()
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(RoleEnum.ADMIN, RoleEnum.MANAGER)
    async add(@Body() dto: AddEquipmentDto) {
        const data = plainToClass(AddEquipmentDto, dto, { excludeExtraneousValues: true });
        return await this.equipmentService.add(data);
    }

    @ApiBearerAuth()
    @Patch('/:id')
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(RoleEnum.ADMIN, RoleEnum.MANAGER)
    async update(@IdParam() id: number, @Body() dto: UpdateEquipmentDto) {
        const data = plainToClass(UpdateEquipmentDto, dto, { excludeExtraneousValues: true });
        return await this.equipmentService.update(id, data);
    }

    @Get('/:id')
    async getEquipment(@IdParam() id: number) {
        return await this.equipmentService.findById(id);
    }
}