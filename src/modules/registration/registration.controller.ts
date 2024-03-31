import { Body, Controller, Post, UseGuards, Request } from "@nestjs/common";
import { RegistrationService } from "./registration.service";
import { ApiBearerAuth } from "@nestjs/swagger";
import { Roles } from "src/common/decorators/roles.decorator";
import { UserRole } from "../user/user.constant";
import { RolesGuard } from "../auth/guard/roles-auth.guard";
import { JwtGuard } from "../auth/guard/jwt-auth.guard";
import { AddRegistrationDto } from "./dtos/add-registration.dto";

@Controller("registration")
export class RegistrationController {
    constructor(private readonly registrationService: RegistrationService) { }
    @ApiBearerAuth()
    @Roles(UserRole.ADMIN)
    @UseGuards(JwtGuard, RolesGuard)
    @Post('equipment')
    async createEquipmentRegistration(@Body() dto: AddRegistrationDto, @Request() req: any) {
        dto.createBy = dto.updateBy = req.user.id;
        return await this.registrationService.createRegistration(dto)
    }
    // @ApiBearerAuth()
    // @Roles(UserRole.ADMIN)
    // @UseGuards(JwtGuard, RolesGuard)
    // @Post('tools')
    // async createToolRegistration(@Body() dto: AddRegistrationDto, @Request() req: any) {
    //     dto.createBy = dto.updateBy = req.user.id;
    //     return await this.registrationService.createToolRegistration(dto)
    // }

}