import { HttpException, HttpStatus, Injectable, flatten } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy } from "passport-google-oauth20";
import { UserService } from "src/user/user.service";
import { VerifiedCallback } from "passport-jwt";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly userService: UserService) {
        super({
            clientID: "712785141750-n27dl5b0qe4a1oa5pjmum734epcfkm7t.apps.googleusercontent.com",
            clientSecret: "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",
            callbackURL: "http://localhost:3000/apis/auths/google/redirect",
            scope: ["profile", "email"]
        })
    }
    async validate(accessToken: string, refreshToken: string, profile: Profile, done: VerifiedCallback) {
        const { name, emails, photos } = profile;
        const user = {
            email: emails[0].value,
            firstName: name.familyName,
            lastName: name.givenName,
            photo: photos[0].value,
            accessToken,
            refreshToken,
        }
        const isCheck = await this.userService.findByEmail(user.email)
        if (!isCheck) {
            await this.userService.createWithEmail({
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            })
        }
        done(null, user)
    }
} 