import { Body, Controller, Post, UseGuards, Patch, Get } from "@nestjs/common";
import { UnitService } from "./unit.service";
import { JwtGuard } from "./../auth/guard/jwt-auth.guard";
import { UserRole } from "./../user/user.constant";
import { Roles } from "./../../common/decorators/roles.decorator";
import { RolesGuard } from "./../auth/guard/roles-auth.guard";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AddUnitDto } from "./dtos/add-unit.dto";
import { UpdateUnitDto } from "./dtos/update.dto";
import { IdParam } from "src/common/decorators/id-param.decorator";

@Controller('units')
@ApiTags('Units')
@ApiBearerAuth()
export class UnitController {
    constructor(
        private readonly unitService: UnitService,
    ) { }

    @Get()
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.MANAGER)
    async getAll() {
        return await this.unitService.findAll();
    }

    @Post()
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.MANAGER)
    async add(@Body() dto: AddUnitDto) {
        const data = AddUnitDto.plainToClass(dto)
        return await this.unitService.add(data);
    }

    @Patch("/:id")
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.MANAGER)
    async update(@IdParam() id: number, @Body() dto: UpdateUnitDto) {
        const data = UpdateUnitDto.plainToClass(dto)
        return await this.unitService.update(id, data);
    }

}