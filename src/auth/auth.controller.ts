import { Body, Controller, HttpException, HttpStatus, Patch, Post, Request, UnauthorizedException, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginAuthDto } from "./dtos/login-auth.dto";
import { RegisterUserDto } from "../user/dtos/register-user.dto";
import { LocalGuard } from "./guard/local-auth.guard";
import { Roles } from "./decorator/roles.decorator";
import { RoleEnum } from "src/auth/enums/role.enum";
import { RolesGuard } from "./guard/roles-auth.guard";
import { JwtGuard } from "./guard/jwt-auth.guard";
import { JwtPayload } from "src/auth/interfaces/jwt.interface";
import { RegisterAdminDto } from "src/user/dtos/register-admin.dto";
import { RegisterManagerDto } from "src/user/dtos/register-manager.dto";
import { ApiBearerAuth } from "@nestjs/swagger";
import { DisableDto } from "./dtos/disable-auth.dto";

@Controller('auths')
export class AuthController {

    constructor(private readonly authService: AuthService) { }

    @UseGuards(LocalGuard)
    @Post('login')
    async login(@Body() user: LoginAuthDto): Promise<any> {
        return await this.authService.credentialByPassword(user.email, user.password)
    }

    @Post('register')
    async register(@Body() user: RegisterUserDto): Promise<any> {
        return await this.authService.registerUser(user) ?
            new HttpException({ message: 'User is created', statusCode: 201 }, HttpStatus.ACCEPTED).getResponse()
            : new UnauthorizedException("User isn't created").getResponse()
    }

    @ApiBearerAuth()
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(RoleEnum.ADMIN)
    @Post('register/manager')
    async registerManager(@Body() user: RegisterManagerDto): Promise<any> {
        return await this.authService.registerManager(user) ?
            new HttpException({ message: 'User is created', statusCode: 201 }, HttpStatus.ACCEPTED).getResponse()
            : new UnauthorizedException("User isn't created").getResponse()
    }

    @ApiBearerAuth()
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(RoleEnum.ADMIN)
    @Post('register/admin')
    async registerAdmin(@Body() user: RegisterAdminDto): Promise<any> {
        return await this.authService.registerAdmin(user) ?
            new HttpException({ message: 'User is created', statusCode: 201 }, HttpStatus.ACCEPTED).getResponse()
            : new UnauthorizedException("User isn't created").getResponse()
    }


    @ApiBearerAuth()
    @UseGuards(JwtGuard)
    @Post('info')
    async info(@Request() req: JwtPayload): Promise<any> {
        return await this.authService.getUserByEmail(req.email)
    }

    @ApiBearerAuth()
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(RoleEnum.ADMIN)
    @Patch('disable')
    async disable(@Body() data: DisableDto) {
        return await this.authService.disable(data.email, data.status)
    }
}