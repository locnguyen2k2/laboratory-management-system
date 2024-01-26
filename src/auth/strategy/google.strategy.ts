import { HttpException, HttpStatus, Injectable, flatten } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy } from "passport-google-oauth20";
import { UserService } from "src/user/user.service";
import { VerifiedCallback } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { UserStatusEnum } from "../enums/user-status.enum";
import { GoogleRedirectDto } from "../dtos/googleRedirect-auth.dto";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly userService: UserService) {
        super({
            clientID: new ConfigService().getOrThrow("GG_CLIENTID"),
            clientSecret: new ConfigService().getOrThrow("GG_CLIENT_SECRET"),
            callbackURL: "http://localhost:3000/apis/auths/google/redirect",
            scope: ["profile", "email"]
        })
    }
    async validate(accessToken: string, refreshToken: string, profile: Profile, done: VerifiedCallback) {
        const { name, emails, photos } = profile;
        const user: GoogleRedirectDto = {
            email: emails[0].value,
            firstName: name.familyName,
            lastName: name.givenName,
            photo: photos[0].value,
            accessToken,
        }
        const isCheck = await this.userService.findByEmail(user.email)
        if (!isCheck) {
            let newUser = await this.userService.createWithEmail({
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            })
            let active = await this.userService.disable(user.email, UserStatusEnum.ACTIVE)
        }
        if (isCheck?.password) {
            throw new HttpException("The email already link to existed account!", HttpStatus.BAD_REQUEST).getResponse()
        }
        done(null, user)
    }
} 