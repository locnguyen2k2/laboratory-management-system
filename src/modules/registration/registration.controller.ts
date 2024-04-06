import { Body, Controller, Post, UseGuards, Request, Get } from "@nestjs/common";
import { RegistrationService } from "./registration.service";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Roles } from "src/common/decorators/roles.decorator";
import { UserRole } from "../user/user.constant";
import { RolesGuard } from "../auth/guard/roles-auth.guard";
import { JwtGuard } from "../auth/guard/jwt-auth.guard";
import { AddRegistrationDto, AddRoomItemRegistrationDto, AddRoomRegistrationDto } from "./dtos/add-registration.dto";
import { IdParam } from "src/common/decorators/id-param.decorator";

@Controller("registration")
@ApiBearerAuth()
@ApiTags('Registration')
export class RegistrationController {
    constructor(private readonly registrationService: RegistrationService) { }

    @Get()
    async getAll() {
        return await this.registrationService.findAll()
    }

    @UseGuards(JwtGuard)
    @Post('')
    async createRegistration(@Body() dto: AddRegistrationDto, @Request() req: any) {
        dto.createBy = dto.updateBy = dto.user = req.user.id;
        const data = AddRegistrationDto.plainToClass(dto);
        return await this.registrationService.createRegistration(data)
    }

    @UseGuards(JwtGuard)
    @Post('/rooms')
    async createRoomRegistration(@Body() dto: AddRoomRegistrationDto, @Request() req: any) {
        dto.createBy = dto.updateBy = dto.user = req.user.id;
        const data = AddRoomRegistrationDto.plainToClass(dto);
        return await this.registrationService.createRoomRegistration(data)
    }

    @Get(':id')
    async getDetail(@IdParam() id: number, @Request() req: any) {
        return await this.registrationService.getDetailById(id)
    }

}