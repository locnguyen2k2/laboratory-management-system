import * as bcrypt from 'bcryptjs'
import { AxiosResponse } from "axios";
import { HttpService } from "@nestjs/axios";
import { UserService } from "./../user/user.service";
import { Observable, lastValueFrom, map } from "rxjs";
import { MailService } from "./../email/mail.service";
import { JwtPayload } from "./interfaces/jwt.interface";
import { UserStatus } from "./../user/user.constant";
import { RegisterUserDto } from "../user/dtos/register.dto";
import { GoogleRedirectDto } from "./dtos/googleRedirect-auth.dto";
import { RegisterAdminDto } from "./../user/dtos/register.dto";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { RegisterManagerDto } from "./../user/dtos/register.dto";
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../user/user.entity';
import { Credential } from './interfaces/credential.interface';
import { BusinessException } from 'src/common/exceptions/biz.exception';
import { ErrorEnum } from 'src/constants/error-code.constant';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
        private readonly emailService: MailService,
        private readonly httpService: HttpService
    ) { }

    async credentialByPassword(email: string, password: string): Promise<Credential> {
        if (await this.emailService.isCtuetEmail(email)) {
            const user = await this.userService.findByEmail(email)
            if (!user || !user?.password || !(await bcrypt.compareSync(password, user?.password))) {
                throw new BusinessException(ErrorEnum.INVALID_LOGIN);
            };
            if (user.status !== UserStatus.ACTIVE) {
                throw new HttpException("Your account not confirmed or blocked!", HttpStatus.UNAUTHORIZED);
            };
            const userInfo = await this.userService.getAccountInfo(email);
            try {
                if (await this.jwtService.verifyAsync(user.token)) {
                    return {
                        userInfo,
                        access_token: user.token
                    }
                }
            } catch (error: any) {
                const payload: JwtPayload = {
                    id: user.id,
                    email: user.email
                };
                const access_token = await this.jwtService.signAsync(payload);
                await this.userService.updateToken(payload.email, access_token);
                return {
                    userInfo,
                    access_token
                }
            }
        }
    }

    async ggAccessTokenVerify(accessToken: string): Promise<Observable<AxiosResponse<any, any>>> {
        return lastValueFrom(this.httpService.get(`https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${accessToken}`).pipe(map((res) => res.data)))
    }

    async credentialWithoutPassword(data: GoogleRedirectDto): Promise<Credential> {
        try {
            const isVerifyToken = await this.ggAccessTokenVerify(data.accessToken).then((res) => res)
            if (isVerifyToken) {
                const newUser = await this.userService.createWithGoogle(data);
                if (newUser) {
                    const userInfo = await this.userService.getAccountInfo(data.email);
                    try {
                        if (await this.jwtService.verifyAsync(newUser.token)) {
                            return {
                                userInfo,
                                access_token: newUser.token
                            }
                        }
                    } catch (error: any) {
                        const payload: JwtPayload = {
                            id: newUser.id,
                            email: newUser.email
                        }
                        const access_token = await this.jwtService.signAsync(payload);
                        await this.userService.updateToken(payload.email, access_token);
                        return {
                            userInfo,
                            access_token
                        }
                    }
                }
            }
        } catch (error) {
            throw new BusinessException(ErrorEnum.INVALID_VERIFICATION_TOKEN)
        }
    }

    async register(user: (RegisterAdminDto | RegisterManagerDto | RegisterUserDto)): Promise<UserEntity> {
        return await this.userService.create(user)
    }

}