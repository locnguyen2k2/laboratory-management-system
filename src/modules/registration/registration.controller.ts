import { Body, Controller, Post, UseGuards, Request, Get, Patch } from "@nestjs/common";
import { RegistrationService } from "./registration.service";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtGuard } from "../auth/guard/jwt-auth.guard";
import { AddItemRegistrationDto } from "./../item-registration/dtos/add-registration.dto";
import { IdParam } from "src/common/decorators/id-param.decorator";
import { RolesGuard } from "../auth/guard/roles-auth.guard";
import { Roles } from "src/common/decorators/roles.decorator";
import { RoleEnum } from "src/enums/role-enum.enum";
import { UpdateItemRegistrationDto } from "../item-registration/dtos/update-borrowing.dto";

@Controller("registration")
@ApiTags('Registration')
@ApiBearerAuth()
export class RegistrationController {
    constructor(private readonly registrationService: RegistrationService) { }

    @Get()
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(RoleEnum.ADMIN, RoleEnum.MANAGER)
    async getAll() {
        return await this.registrationService.findAll()
    }

    @Get('my-borrowing')
    @UseGuards(JwtGuard)
    async getUserBorrowing(@Request() req: any) {
        return await this.registrationService.findByUser(req.user.id)
    }

    @Post('')
    @UseGuards(JwtGuard)
    async createRegistration(@Body() dto: AddItemRegistrationDto, @Request() req: any) {
        dto.createBy = dto.updateBy = dto.user = req.user.id;
        const data = AddItemRegistrationDto.plainToClass(dto);
        return await this.registrationService.createRegistration(data)
    }

    @Patch('item-registration/:id')
    @UseGuards(JwtGuard)
    async update(@IdParam() id: number, @Request() req: any, @Body() dto: UpdateItemRegistrationDto) {
        const data = UpdateItemRegistrationDto.plainToClass(dto)
        return await this.registrationService.updateByItemRegId(id, req.user.id, data)
    }

    @Get(':id')
    async getDetail(@IdParam() id: number, @Request() req: any) {
        return await this.registrationService.getDetailById(id)
    }

}