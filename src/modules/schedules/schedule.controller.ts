import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { ScheduleService } from "./schedule.service";
import { RolesGuard } from "../auth/guard/roles-auth.guard";
import { JwtGuard } from "../auth/guard/jwt-auth.guard";
import { UserRole } from "../user/user.constant";
import { Roles } from "src/common/decorators/roles.decorator";
import { AddScheduleDto } from "./dtos/add-schedule.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@Controller('schedules')
@ApiBearerAuth()
@ApiTags('Schedules')
export class ScheduleController {
    constructor(private readonly scheduleService: ScheduleService) { }

    @Post()
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.MANAGER)
    async addSchedule(@Body() dto: AddScheduleDto) {
        const data = AddScheduleDto.plainToClass(dto);
        return await this.scheduleService.addSchedule(data);
    }
}