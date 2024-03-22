import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "./../auth.service";
import { HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { UserStatus } from "./../../user/user.constant";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService) { super({ usernameField: 'email' }) }
    async validate(usernameField: string, password: string) {
        const user = await this.authService.credentialByPassword(usernameField, password)
        if (!user || user.status !== UserStatus.ACTIVE) {
            throw new HttpException("Your account is not existed or blocked", HttpStatus.BAD_REQUEST);
        }
        return user;
    }
}