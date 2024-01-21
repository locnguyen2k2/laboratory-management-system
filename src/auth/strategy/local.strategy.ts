import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "./../auth.service";
import { Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService) { super({ usernameField: 'email' }) }
    async validate(usernameField: string, password: string): Promise<any> {
        const isCheck = await this.authService.validateUser(usernameField, password)
        if (!isCheck) {
            throw new UnauthorizedException(`The email ${usernameField} or password is incorrect`);
        }
        return { email: usernameField, password: password }
    }
}