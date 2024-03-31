import { Body, Controller, Get, Patch, Post, UseGuards, Request } from "@nestjs/common";
import { ChemicalsService } from "./chemicals.service";
import { ApiBearerAuth } from "@nestjs/swagger";
import { IdParam } from "src/common/decorators/id-param.decorator";
import { Roles } from "src/common/decorators/roles.decorator";
import { JwtGuard } from "../auth/guard/jwt-auth.guard";
import { RolesGuard } from "../auth/guard/roles-auth.guard";
import { UserRole } from "../user/user.constant";
import { AddChemicalDto } from "./dtos/add-chemicals.dto";
import { UpdateChemicalDto } from "./dtos/update-chemicals.dto";
import { plainToClass } from "class-transformer";

@Controller('chemicals')
export class ChemicalsController {
    constructor(
        private readonly chemicalService: ChemicalsService
    ) { }

    @ApiBearerAuth()
    @Get()
    async get() {
        return await this.chemicalService.findAll();
    }

    @ApiBearerAuth()
    @Post()
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.MANAGER)
    async add(@Body() dto: AddChemicalDto, @Request() req: any) {
        const data = plainToClass(AddChemicalDto, dto, { excludeExtraneousValues: true });
        data.createBy = data.updateBy = req.user.id
        return await this.chemicalService.add(data);
    }

    @ApiBearerAuth()
    @Patch('/:id')
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.MANAGER)
    async update(@IdParam() id: number, @Body() dto: UpdateChemicalDto, @Request() req: any) {
        dto.updateBy = req.user.id;
        return await this.chemicalService.update(id, dto);
    }

    @Get('/:id')
    async getEquipment(@IdParam() id: number) {
        return await this.chemicalService.findById(id);
    }
}