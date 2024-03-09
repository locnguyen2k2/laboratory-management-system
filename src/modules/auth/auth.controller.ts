import { AuthService } from "./auth.service";
import { ApiBearerAuth } from "@nestjs/swagger";
import { JwtGuard } from "./guard/jwt-auth.guard";
import { Roles } from "./decorator/roles.decorator";
import { LoginAuthDto } from "./dtos/login-auth.dto";
import { RoleEnum } from "./../auth/enums/role.enum";
import { DisableDto } from "./dtos/disable-auth.dto";
import { RolesGuard } from "./guard/roles-auth.guard";
import { RegisterUserDto } from "../user/dtos/register-user.dto";
import { GoogleRedirectDto } from "./dtos/googleRedirect-auth.dto";
import { ResetPaswordDto } from "./../auth/dtos/reset-password.dto";
import { RegisterAdminDto } from "./../user/dtos/register-admin.dto";
import { RegisterManagerDto } from "./../user/dtos/register-manager.dto";
import { Body, Controller, Get, Patch, Post, Query, Request, UseGuards } from "@nestjs/common";
import { UserService } from "../user/user.service";

@Controller('auths')
export class AuthController {
    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService,
    ) { }

    @Post('login')
    async login(@Body() user: LoginAuthDto): Promise<any> {
        return await this.authService.credentialByPassword(user.email, user.password);
    }

    @Post('google-login')
    async loginWithGoogle(@Body() data: GoogleRedirectDto) {
        return await this.authService.credentialWithoutPassword(data)

    }

    @Post('register')
    async register(@Body() data: RegisterUserDto): Promise<any> {
        const user = RegisterUserDto.plainToClass(data);
        return this.authService.register(user);
    }

    @ApiBearerAuth()
    @Post('manager-create')
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(RoleEnum.ADMIN)
    async registerManager(@Body() data: RegisterManagerDto): Promise<any> {
        const manager = RegisterManagerDto.plainToClass(data);
        return await this.authService.register(manager);
    }

    @ApiBearerAuth()
    @Post('admin-create')
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(RoleEnum.ADMIN)
    async registerAdmin(@Body() data: RegisterAdminDto): Promise<any> {
        const admin = RegisterAdminDto.plainToClass(data);
        return await this.authService.register(admin);
    }

}
