import { Body, Controller, Patch, Post, UseGuards, Get, Request } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { JwtGuard } from "../auth/guard/jwt-auth.guard";
import { RolesGuard } from "../auth/guard/roles-auth.guard";
import { Roles } from "src/common/decorators/roles.decorator";
import { UserRole } from "./../user/user.constant";
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
    @Roles(UserRole.ADMIN, UserRole.MANAGER)
    async add(@Body() dto: AddEquipmentDto, @Request() req: any) {
        const data = plainToClass(AddEquipmentDto, dto, { excludeExtraneousValues: true });
        data.createBy = data.updateBy = req.user.id;
        return await this.equipmentService.add(data);
    }

    @ApiBearerAuth()
    @Patch('/:id')
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.MANAGER)
    async update(@IdParam() id: number, @Body() dto: UpdateEquipmentDto, @Request() req: any) {
        const data = plainToClass(UpdateEquipmentDto, dto, { excludeExtraneousValues: true });
        data.updateBy = req.user.id
        return await this.equipmentService.update(id, data);
    }

    @Get('/:id')
    async getEquipment(@IdParam() id: number) {
        return await this.equipmentService.findById(id);
    }
}