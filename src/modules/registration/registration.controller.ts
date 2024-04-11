import { Body, Controller, Post, UseGuards, Request, Get, Patch } from "@nestjs/common";
import { RegistrationService } from "./registration.service";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtGuard } from "../auth/guard/jwt-auth.guard";
import { AddItemRegistrationDto } from "./../item-registration/dtos/add-registration.dto";
import { IdParam } from "src/common/decorators/id-param.decorator";

@Controller("registration")
@ApiTags('Registration')
@ApiBearerAuth()
export class RegistrationController {
    constructor(private readonly registrationService: RegistrationService) { }

    @Get()
    async getAll() {
        return await this.registrationService.findAll()
    }

    @Post('')
    @UseGuards(JwtGuard)
    async createRegistration(@Body() dto: AddItemRegistrationDto, @Request() req: any) {
        dto.createBy = dto.updateBy = dto.user = req.user.id;
        const data = AddItemRegistrationDto.plainToClass(dto);
        return await this.registrationService.createRegistration(data)
    }

    @Patch('')
    @UseGuards(JwtGuard)
    async updateItemRegistrartion() { }

    @Get(':id')
    async getDetail(@IdParam() id: number, @Request() req: any) {
        return await this.registrationService.getDetailById(id)
    }

}