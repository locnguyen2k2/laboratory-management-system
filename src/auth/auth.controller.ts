import { Body, Controller, Get, Patch, Post, Query, Request, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginAuthDto } from "./dtos/login-auth.dto";
import { RegisterUserDto } from "../user/dtos/register-user.dto";
import { Roles } from "./decorator/roles.decorator";
import { RoleEnum } from "src/auth/enums/role.enum";
import { RolesGuard } from "./guard/roles-auth.guard";
import { JwtGuard } from "./guard/jwt-auth.guard";
import { RegisterAdminDto } from "src/user/dtos/register-admin.dto";
import { RegisterManagerDto } from "src/user/dtos/register-manager.dto";
import { ApiBearerAuth } from "@nestjs/swagger";
import { DisableDto } from "./dtos/disable-auth.dto";
import { EmailService } from "src/email/email.service";
import { ConfirmationEmailDto } from "./dtos/confirmationEmail-auth.dto";
import { GoogleRedirectDto } from "./dtos/googleRedirect-auth.dto";
import { ResetPaswordDto } from "src/auth/dtos/reset-password.dto";
import { ConfirmRePasswordDto } from "./dtos/confirm-repassword.dto";

@Controller('auths')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly emailService: EmailService,

    ) { }

    @Post('login')
    async login(@Body() user: LoginAuthDto): Promise<any> {
        return await this.authService.credentialByPassword(user.email, user.password);
    }

    @Get('google-login')
    async loginWithGoogle(@Body() data: GoogleRedirectDto) {
        return await this.authService.credentialWithoutPassword(data)

    }

    @Post('user-register')
    async register(@Body() data: RegisterUserDto): Promise<any> {
        const user = RegisterUserDto.plainToClass(data);
        return this.authService.register(user);
    }

    @ApiBearerAuth()
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(RoleEnum.ADMIN)
    @Post('manager-register')
    async registerManager(@Body() data: RegisterManagerDto): Promise<any> {
        const manager = RegisterManagerDto.plainToClass(data);
        return await this.authService.register(manager);
    }

    @ApiBearerAuth()
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(RoleEnum.ADMIN)
    @Post('admin-register')
    async registerAdmin(@Body() data: RegisterAdminDto): Promise<any> {
        const admin = RegisterAdminDto.plainToClass(data);
        return await this.authService.register(admin);
    }

    @Get('confirm-email')
    async confirmRegister(@Query() confirmationEmailData: ConfirmationEmailDto) {
        const email = await this.emailService.decodeConfirmationToken(confirmationEmailData.token)
        return await this.emailService.confirmEmail(email);
    }

    @ApiBearerAuth()
    @UseGuards(JwtGuard)
    @Get('info')
    async info(@Request() req: any): Promise<any> {
        return await this.authService.getUserByEmail(req.user.email)
    }

    @ApiBearerAuth()
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(RoleEnum.ADMIN)
    @Patch('disable')
    async disable(@Body() data: DisableDto) {
        return await this.authService.disable(data.email, data.status);
    }

    @ApiBearerAuth()
    @Patch('reset-password')
    async resetPassword(@Body() data: ResetPaswordDto): Promise<any> {
        return await this.authService.resetPassword(data.email);
    }
    @ApiBearerAuth()
    @Patch('confirm-reset-password')
    async confirmRePassword(@Body() data: ConfirmRePasswordDto): Promise<any> {
        return await this.authService.confirmRePassword(data)
    }
}
