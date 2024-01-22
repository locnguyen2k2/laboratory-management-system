import { Body, Controller, Get, HttpException, HttpStatus, Post, Request, UnauthorizedException, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginAuthDto } from "./dtos/login-auth.dto";
import { RegisterUserDto } from "../user/dtos/register-user.dto";
import { LocalGuard } from "./guard/local-auth.guard";
import { Roles } from "./decorator/roles.decorator";
import { RoleEnum } from "src/auth/enums/role.enum";
import { RolesGuard } from "./guard/roles-auth.guard";
import { JwtGuard } from "./guard/jwt-auth.guard";
import { JwtPayload } from "src/auth/interfaces/jwt.interface";

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
        return await this.authService.register(user) ?
            new HttpException({ message: 'User is created', statusCode: 201 }, HttpStatus.ACCEPTED).getResponse()
            : new UnauthorizedException("User isn't created").getResponse()
    }

    @UseGuards(JwtGuard)
    @Post('info')
    async info(@Request() req: JwtPayload): Promise<any> {
        return await this.authService.getUserByEmail(req.email)
    }
}