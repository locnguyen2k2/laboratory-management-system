import { AuthService } from "./auth.service";
import { ApiBearerAuth } from "@nestjs/swagger";
import { JwtGuard } from "./guard/jwt-auth.guard";
import { Roles } from "./../../common/decorators/roles.decorator";
import { LoginAuthDto } from "./dtos/login-auth.dto";
import { RoleEnum } from "../../common/enums/role.enum";
import { RolesGuard } from "./guard/roles-auth.guard";
import { RegisterUserDto } from "../user/dtos/register.dto";
import { GoogleRedirectDto } from "./dtos/googleRedirect-auth.dto";
import { RegisterAdminDto } from "./../user/dtos/register.dto";
import { RegisterManagerDto } from "./../user/dtos/register.dto";
import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { plainToClass } from "class-transformer";

@Controller('auths')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    async login(@Body() dto: LoginAuthDto): Promise<any> {
        return await this.authService.credentialByPassword(dto.email, dto.password);
    }

    @Post('google-login')
    async loginWithGoogle(@Body() dto: GoogleRedirectDto) {
        return await this.authService.credentialWithoutPassword(dto)

    }

    @Post('register')
    async register(@Body() dto: RegisterUserDto): Promise<any> {
        const user = plainToClass(RegisterUserDto, dto, { excludeExtraneousValues: true });
        return this.authService.register(user);
    }

    @ApiBearerAuth()
    @Post('manager-create')
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(RoleEnum.ADMIN)
    async registerManager(@Body() dto: RegisterManagerDto): Promise<any> {
        const manager = plainToClass(RegisterManagerDto, dto, { excludeExtraneousValues: true });
        return await this.authService.register(manager);
    }

    @ApiBearerAuth()
    @Post('admin-create')
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(RoleEnum.ADMIN)
    async registerAdmin(@Body() dto: RegisterAdminDto): Promise<any> {
        const admin = plainToClass(RegisterAdminDto, dto, { excludeExtraneousValues: true });
        return await this.authService.register(admin);
    }

}
