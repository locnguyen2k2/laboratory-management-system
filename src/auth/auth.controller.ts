import { Body, Controller, HttpException, Post, Request, UnauthorizedException, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginAuthDto } from "./dtos/login-auth.dto";
import { RegisterAuthDto } from "./dtos/register-auth.dto";
import { LocalGuard } from "./guard/local-auth.guard";
import { JwtStrategy } from "./strategy/jwt.strategy";

@Controller('auths')
export class AuthController {

    constructor(private readonly authService: AuthService) { }

    // Tested
    @UseGuards(LocalGuard)
    @Post('login')
    async login(@Body() user: LoginAuthDto): Promise<any> {
        return user
    }

    // Tested
    @Post('register')
    async register(@Body() user: RegisterAuthDto): Promise<any> {
        return await this.authService.register(user) ?
            new HttpException({ message: 'User is created', statusCode: 201 }, 201).getResponse()
            : new UnauthorizedException("User isn't created").getResponse()
    }

    // @UseGuards(JwtStrategy)
    @Post('logout')
    async logout(@Request() req: any): Promise<any> {
        console.log(req.payload)
    }
}