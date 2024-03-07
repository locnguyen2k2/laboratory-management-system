import { Body, Controller, Get, HttpException, HttpStatus, Patch, Post, Query, Request, UnauthorizedException, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginAuthDto } from "./dtos/login-auth.dto";
import { RegisterUserDto } from "../user/dtos/register-user.dto";
import { LocalGuard } from "./guard/local-auth.guard";
import { Roles } from "./decorator/roles.decorator";
import { RoleEnum } from "src/auth/enums/role.enum";
import { RolesGuard } from "./guard/roles-auth.guard";
import { JwtGuard } from "./guard/jwt-auth.guard";
import { RegisterAdminDto } from "src/user/dtos/register-admin.dto";
import { RegisterManagerDto } from "src/user/dtos/register-manager.dto";
import { ApiBearerAuth } from "@nestjs/swagger";
import { DisableDto } from "./dtos/disable-auth.dto";
// import { GoogleGuard } from "./guard/google-auth.guard";
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

    @UseGuards(LocalGuard)
    @Post('login')
    async login(@Body() user: LoginAuthDto): Promise<any> {
        const access_token = await this.authService.credentialByPassword(user.email, user.password)
        return new HttpException({ message: access_token, status: 200 }, HttpStatus.ACCEPTED).getResponse()
    }

    // @UseGuards(GoogleGuard)
    // @Get('google/login')
    // async loginWithGoogle() { }
    // @UseGuards(GoogleGuard)
    @Get('google/login')
    async handleRedirect(@Body() data: GoogleRedirectDto) {
        try {
            const isVerifyToken = await this.authService.ggAccessTokenVerify(data.accessToken).then((res) => res)
            if (isVerifyToken) {
                const isEmailCTUET = await this.authService.isCtuetEmail(data.email);
                if (!isEmailCTUET) {
                    throw new HttpException({ message: "This email must have the extension 'ctuet.edu.vn'!", status: 404 }, HttpStatus.ACCEPTED)
                }
                const user = await this.authService.getUserByEmail(data.email)
                const access_token = await this.authService.credentialWithoutPassword(user.email)
                return { access_token: access_token.access_token, status: 200 };
            }
        } catch (error) {
            throw new HttpException({ message: "Your email is not verified or the token is invalid", status: 404 }, HttpStatus.ACCEPTED)
        }
    }

    @Post('user-register')
    async register(@Body() data: RegisterUserDto): Promise<any> {
        const isEmailCTUET = await this.authService.isCtuetEmail(data.email);
        if (!isEmailCTUET) {
            throw new HttpException({ message: "This email must have the extension 'ctuet.edu.vn'!", status: 404 }, HttpStatus.ACCEPTED)
        }
        const user = RegisterUserDto.plainToClass(data);
        throw await this.authService.register(user) ?
            new HttpException({ message: 'The account has been created, verify your email to continute!', status: 200 }, HttpStatus.ACCEPTED).getResponse()
            : new HttpException({ message: "The email already link to another account or is existed!", status: 404 }, HttpStatus.ACCEPTED)
    }

    @ApiBearerAuth()
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(RoleEnum.ADMIN)
    @Post('manager-register')
    async registerManager(@Body() data: RegisterManagerDto): Promise<any> {
        const isEmailCTUET = await this.authService.isCtuetEmail(data.email);
        if (!isEmailCTUET) {
            return new HttpException({ message: "This email must have the extension 'ctuet.edu.vn'!", status: 404 }, HttpStatus.ACCEPTED)
        }
        const manager = RegisterManagerDto.plainToClass(data);
        return await this.authService.register(manager) ?
            new HttpException({ message: 'The account has been created, verify your email to continute!', status: 202 }, HttpStatus.ACCEPTED).getResponse()
            : new HttpException({ message: "The email already link to another account or is existed!", status: 404 }, HttpStatus.ACCEPTED)
    }

    @ApiBearerAuth()
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(RoleEnum.ADMIN)
    @Post('admin-register')
    async registerAdmin(@Body() data: RegisterAdminDto): Promise<any> {
        const isEmailCTUET = await this.authService.isCtuetEmail(data.email);
        if (!isEmailCTUET) {
            return new HttpException({ message: "This email must have the extension 'ctuet.edu.vn'!", status: 404 }, HttpStatus.ACCEPTED)
        }
        const admin = RegisterAdminDto.plainToClass(data);
        return await this.authService.register(admin) ?
            new HttpException({ message: 'The account has been created, verify your email to continute!', status: 202 }, HttpStatus.ACCEPTED).getResponse()
            : new HttpException({ message: "The email already link to another account or is existed!", status: 404 }, HttpStatus.ACCEPTED)
    }

    @Get('confirm-email')
    async confirmRegister(@Query() confirmationEmailData: ConfirmationEmailDto) {
        const email = await this.emailService.decodeConfirmationToken(confirmationEmailData.token)
        return await this.emailService.confirmEmail(email) ? new HttpException({ message: "The email is confirmed", status: 202 }, HttpStatus.ACCEPTED).getResponse() : new HttpException({ message: "Can not confirm this email", status: 404 }, HttpStatus.ACCEPTED);
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
        return await this.authService.disable(data.email, data.status) ? new HttpException({ message: "User's status is updated", status: 202 }, HttpStatus.ACCEPTED).getResponse() : new HttpException({ message: "User not found", status: 404 }, HttpStatus.ACCEPTED)
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
