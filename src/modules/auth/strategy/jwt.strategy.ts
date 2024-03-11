import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayload } from "./../../auth/interfaces/jwt.interface";
import { UserService } from "src/modules/user/user.service";
import { UserStatusEnum } from "src/common/enums/user-status.enum";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly userService: UserService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRETKEY
        })
    }
    async validate(payload: JwtPayload) {
        const user = await this.userService.findByEmail(payload.email);
        if (!user || user.status !== UserStatusEnum.ACTIVE) {
            throw new HttpException("Your account is not existed or blocked", HttpStatus.BAD_REQUEST);
        }
        return { id: payload.id, email: payload.email }
    }
} 