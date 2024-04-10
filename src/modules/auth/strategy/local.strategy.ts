import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "./../auth.service";
import { Injectable } from "@nestjs/common";
import { UserStatus } from "./../../user/user.constant";
import { Credential } from "../interfaces/credential.interface";
import { BusinessException } from "src/common/exceptions/biz.exception";
import { ErrorEnum } from "src/constants/error-code.constant";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService) { super({ usernameField: 'email' }) }
    async validate(usernameField: string, password: string): Promise<Credential> {
        const { userInfo, access_token } = await this.authService.credentialByPassword(usernameField, password)
        if (!userInfo || userInfo.status !== UserStatus.ACTIVE) {
            throw new BusinessException(ErrorEnum.USER_INVALID);
        }
        return { userInfo, access_token };
    }
}