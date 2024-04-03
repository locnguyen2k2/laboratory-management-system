import { Body, Controller, Patch, Post, UseGuards, Get, Request } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
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
@ApiBearerAuth()
@ApiTags('Equipment')
export class EquipmentController {
    constructor(
        private readonly equipmentService: EquipmentService
    ) { }

    @Get()
    async get() {
        return await this.equipmentService.findAll();
    }

    @Post()
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.MANAGER)
    async add(@Body() dto: AddEquipmentDto, @Request() req: any) {
        const data = AddEquipmentDto.plainToClass(dto);
        data.createBy = data.updateBy = req.user.id;
        return await this.equipmentService.add(data);
    }

    @Patch('/:id')
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.MANAGER)
    async update(@IdParam() id: number, @Body() dto: UpdateEquipmentDto, @Request() req: any) {
        const data = UpdateEquipmentDto.plainToClass(dto);
        data.updateBy = req.user.id
        return await this.equipmentService.update(id, data);
    }

    @Get('/:id')
    async getEquipment(@IdParam() id: number) {
        return await this.equipmentService.findById(id);
    }
}