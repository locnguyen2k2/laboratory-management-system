import { Body, Controller, Get, Patch, Post, UseGuards, Request } from "@nestjs/common";
import { ToolsService } from "./tools.service";
import { AddToolDto } from "./dtos/add-tool.dto";
import { UpdateToolDto } from "./dtos/update-tool.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { plainToClass } from "class-transformer";
import { IdParam } from "src/common/decorators/id-param.decorator";
import { Roles } from "src/common/decorators/roles.decorator";
import { JwtGuard } from "../auth/guard/jwt-auth.guard";
import { RolesGuard } from "../auth/guard/roles-auth.guard";
import { UserRole } from "../user/user.constant";

@Controller("tools")
@ApiBearerAuth()
@ApiTags('Tools')
export class ToolsController {
    constructor(
        private readonly toolService: ToolsService
    ) { }

    @Get()
    async get() {
        return await this.toolService.findAll();
    }

    @Post()
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.MANAGER)
    async add(@Body() dto: AddToolDto, @Request() req: any) {
        const data = AddToolDto.plainToClass(dto);
        data.createBy = data.updateBy = req.user.id;
        return await this.toolService.add(data);
    }

    @Patch('/:id')
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.MANAGER)
    async update(@IdParam() id: number, @Body() dto: UpdateToolDto, @Request() req: any) {
        dto.updateBy = req.user.id
        const data = plainToClass(UpdateToolDto, dto, { excludeExtraneousValues: true });
        return await this.toolService.update(id, data);
    }

    @Get('/:id')
    async getEquipment(@IdParam() id: number) {
        return await this.toolService.findById(id);
    }
}