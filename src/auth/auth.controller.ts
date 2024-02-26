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
import { GoogleGuard } from "./guard/google-auth.guard";
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
        return new HttpException(access_token, HttpStatus.ACCEPTED)
    }

    @UseGuards(GoogleGuard)
    @Get('google/login')
    async loginWithGoogle() {
        console.log("Login with Google account processing...!")
    }

    @UseGuards(GoogleGuard)
    @Get('google/redirect')
    async handleRedirect(@Request() req: any) {
        const data: GoogleRedirectDto = req.user;
        const user = await this.authService.getUserByEmail(data.email)
        const access_token = await this.authService.credentialWithoutPassword(user.email)
        return new HttpException(access_token, HttpStatus.ACCEPTED)
    }

    @Post('register')
    async register(@Body() user: RegisterUserDto): Promise<any> {
        const emailHandle = (user.email.split('@'))[1];
        const isEmailCTUET = emailHandle.includes('ctuet.edu.vn');
        if (!isEmailCTUET) {
            return new HttpException("This email must have the extension 'ctuet.edu.vn'!", HttpStatus.BAD_REQUEST)
        }
        return await this.authService.registerUser(user) ?
            new HttpException('The account has been created, verify your email to continute!', HttpStatus.ACCEPTED)
            : new HttpException("The email already link to another account or is existed!", HttpStatus.NOT_ACCEPTABLE)
    }

    @Get('confirm-email')
    async confirmRegister(@Query() confirmationEmailData: ConfirmationEmailDto) {
        const email = await this.emailService.decodeConfirmationToken(confirmationEmailData.token)
        return await this.emailService.confirmEmail(email) ? new HttpException("The email is confirmed", HttpStatus.ACCEPTED) : new HttpException("Can not confirm this email", HttpStatus.BAD_REQUEST);
    }

    @ApiBearerAuth()
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(RoleEnum.ADMIN)
    @Post('register/manager')
    async registerManager(@Body() user: RegisterManagerDto): Promise<any> {
        const emailHandle = (user.email.split('@'))[1];
        const isEmailCTUET = emailHandle.includes('ctuet.edu.vn');
        if (!isEmailCTUET) {
            return new HttpException("This email must have the extension 'ctuet.edu.vn'!", HttpStatus.BAD_REQUEST)
        }
        return await this.authService.registerManager(user) ?
            new HttpException({ message: 'User is created', statusCode: 201 }, HttpStatus.ACCEPTED).getResponse()
            : new UnauthorizedException("User isn't created").getResponse()
    }

    @ApiBearerAuth()
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(RoleEnum.ADMIN)
    @Post('register/admin')
    async registerAdmin(@Body() user: RegisterAdminDto): Promise<any> {
        const emailHandle = (user.email.split('@'))[1];
        const isEmailCTUET = emailHandle.includes('ctuet.edu.vn');
        if (!isEmailCTUET) {
            return new HttpException("This email must have the extension 'ctuet.edu.vn'!", HttpStatus.BAD_REQUEST)
        }
        return await this.authService.registerAdmin(user) ?
            new HttpException({ message: 'User is created', statusCode: 201 }, HttpStatus.ACCEPTED).getResponse()
            : new UnauthorizedException("User isn't created").getResponse()
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
        return await this.authService.disable(data.email, data.status) ? new HttpException("User's status is updated", HttpStatus.ACCEPTED) : new HttpException("User not found", HttpStatus.NOT_FOUND)
    }

    @ApiBearerAuth()
    @Patch('reset-password')
    async resetPassword(@Body() data: ResetPaswordDto): Promise<any> {
        const isResult = await this.authService.resetPassword(data.email);
        if (isResult) {
            return new HttpException("Digital numbers send to your email!", HttpStatus.ACCEPTED)
        }
        return new HttpException("Email not found or not yet register!", HttpStatus.NOT_FOUND)
    }
    @ApiBearerAuth()
    @Patch('confirm-reset-password')
    async confirmRePassword(@Body() data: ConfirmRePasswordDto): Promise<any> {
        return await this.authService.confirmRePassword(data)
    }
}