import { Body, Controller, Post, UseGuards, Request, Get } from "@nestjs/common";
import { RegistrationService } from "./registration.service";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtGuard } from "../auth/guard/jwt-auth.guard";
import { AddRegistrationDto } from "./dtos/add-registration.dto";
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

    @Get(':id')
    async getDetail(@IdParam() id: number, @Request() req: any) {
        return await this.registrationService.getDetailById(id)
    }

}