import { Body, Controller, Post, UseGuards, Request, Get } from "@nestjs/common";
import { RegistrationService } from "./registration.service";
import { ApiBearerAuth } from "@nestjs/swagger";
import { Roles } from "src/common/decorators/roles.decorator";
import { UserRole } from "../user/user.constant";
import { RolesGuard } from "../auth/guard/roles-auth.guard";
import { JwtGuard } from "../auth/guard/jwt-auth.guard";
import { AddRegistrationDto } from "./dtos/add-registration.dto";
import { IdParam } from "src/common/decorators/id-param.decorator";

@Controller("registration")
export class RegistrationController {
    constructor(private readonly registrationService: RegistrationService) { }
    @ApiBearerAuth()
    @Roles(UserRole.ADMIN)
    @UseGuards(JwtGuard, RolesGuard)
    @Post('')
    async createRegistration(@Body() dto: AddRegistrationDto, @Request() req: any) {
        dto.createBy = dto.updateBy = req.user.id;
        return await this.registrationService.createRegistration(dto)
    }

    @ApiBearerAuth()
    @Get(':id')
    async getDetail(@IdParam() id: number, @Request() req: any) {
        return await this.registrationService.getDetailById(id)
    }
}