import { Body, Controller, Post, UseGuards, Patch, Get } from "@nestjs/common";
import { HandoverStatusService } from "./handover_status.service";
import { JwtGuard } from "./../auth/guard/jwt-auth.guard";
import { UserRole } from "./../user/user.constant";
import { Roles } from "./../../common/decorators/roles.decorator";
import { RolesGuard } from "./../auth/guard/roles-auth.guard";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AddHandoverStatusDto } from "./dtos/add-handover_status.dto";
import { UpdateHandoverStatusDto } from "./dtos/update-handover_status.dto";
import { IdParam } from "src/common/decorators/id-param.decorator";

@Controller('handover-status')
@ApiBearerAuth()
@ApiTags('Handover Status')
export class HandoverStatusController {
    constructor(
        private readonly handoverStatusService: HandoverStatusService,
    ) { }

    @Get()
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.MANAGER)
    async getAll() {
        return await this.handoverStatusService.findAll();
    }

    @Post()
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.MANAGER)
    async add(@Body() dto: AddHandoverStatusDto) {
        const data = AddHandoverStatusDto.plainToClass(dto)
        return await this.handoverStatusService.add(data);
    }

    @Patch("/:id")
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.MANAGER)
    async update(@IdParam() id: number, @Body() dto: UpdateHandoverStatusDto) {
        const data = UpdateHandoverStatusDto.plainToClass(dto)
        return await this.handoverStatusService.update(id, data);
    }

}