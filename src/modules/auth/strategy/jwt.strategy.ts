import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayload } from "./../../auth/interfaces/jwt.interface";
import { UserService } from "src/modules/user/user.service";
import { UserStatus } from "./../../user/user.constant";
import { BusinessException } from "src/common/exceptions/biz.exception";
import { ErrorEnum } from "src/constants/error-code.constant";

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
    async validate(payload: JwtPayload): Promise<JwtPayload> {
        if (await this.userService.findById(payload.id)) {
            const user = await this.userService.findById(payload.id);
            if (user.status == UserStatus.ACTIVE) {
                return { id: payload.id, email: payload.email }
            }
            throw new BusinessException(ErrorEnum.USER_IS_BLOCKED);
        }
    }
}