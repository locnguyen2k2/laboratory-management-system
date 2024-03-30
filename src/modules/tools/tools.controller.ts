import { Body, Controller, Get, Patch, Post, UseGuards, Request } from "@nestjs/common";
import { ToolsService } from "./tools.service";
import { AddToolDto } from "./dtos/add-tool.enum";
import { UpdateToolDto } from "./dtos/update-tool.enum";
import { ApiBearerAuth } from "@nestjs/swagger";
import { plainToClass } from "class-transformer";
import { IdParam } from "src/common/decorators/id-param.decorator";
import { Roles } from "src/common/decorators/roles.decorator";
import { JwtGuard } from "../auth/guard/jwt-auth.guard";
import { RolesGuard } from "../auth/guard/roles-auth.guard";
import { UserRole } from "../user/user.constant";

@Controller("tools")
export class ToolsController {
    constructor(
        private readonly toolService: ToolsService
    ) { }

    @ApiBearerAuth()
    @Get()
    async get() {
        return await this.toolService.findAll();
    }

    @ApiBearerAuth()
    @Post()
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.MANAGER)
    async add(@Body() dto: AddToolDto, @Request() req: any) {
        const data = plainToClass(AddToolDto, dto, { excludeExtraneousValues: true });
        data.createBy = data.updateBy = req.user.id;
        return await this.toolService.add(data);
    }

    @ApiBearerAuth()
    @Patch('/:id')
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.MANAGER)
    async update(@IdParam() id: number, @Body() dto: UpdateToolDto, @Request() req: any) {
        const data = plainToClass(UpdateToolDto, dto, { excludeExtraneousValues: true });
        data.updateBy = req.user.id
        return await this.toolService.update(id, data);
    }

    @Get('/:id')
    async getEquipment(@IdParam() id: number) {
        return await this.toolService.findById(id);
    }
}