import { AuthService } from "./auth.service";
import { ApiBearerAuth } from "@nestjs/swagger";
import { JwtGuard } from "./guard/jwt-auth.guard";
import { Roles } from "./../../common/decorators/roles.decorator";
import { LoginAuthDto } from "./dtos/login-auth.dto";
import { UserRole } from "./../user/user.constant";
import { RolesGuard } from "./guard/roles-auth.guard";
import { RegisterUserDto } from "../user/dtos/register.dto";
import { GoogleRedirectDto } from "./dtos/googleRedirect-auth.dto";
import { RegisterAdminDto } from "./../user/dtos/register.dto";
import { RegisterManagerDto } from "./../user/dtos/register.dto";
import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { plainToClass } from "class-transformer";
import { Credential } from "./interfaces/credential.interface";
import { UserEntity } from "../user/user.entity";

@Controller('auths')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    async login(@Body() dto: LoginAuthDto): Promise<Credential> {
        return await this.authService.credentialByPassword(dto.email, dto.password);
    }

    @Post('google-login')
    async loginWithGoogle(@Body() dto: GoogleRedirectDto): Promise<Credential> {
        return await this.authService.credentialWithoutPassword(dto)
    }

    @Post('register')
    async register(@Body() dto: RegisterUserDto): Promise<UserEntity> {
        const user = plainToClass(RegisterUserDto, dto, { excludeExtraneousValues: true });
        return this.authService.register(user);
    }

    @ApiBearerAuth()
    @Post('manager-create')
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.MANAGER)
    async registerManager(@Body() dto: RegisterManagerDto): Promise<UserEntity> {
        const manager = plainToClass(RegisterManagerDto, dto, { excludeExtraneousValues: true });
        return await this.authService.register(manager);
    }

    @ApiBearerAuth()
    @Post('admin-create')
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    async registerAdmin(@Body() dto: RegisterAdminDto): Promise<UserEntity> {
        const admin = plainToClass(RegisterAdminDto, dto, { excludeExtraneousValues: true });
        return await this.authService.register(admin);
    }

}
