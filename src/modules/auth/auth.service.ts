import * as bcrypt from 'bcryptjs'
import { AxiosResponse } from "axios";
import { HttpService } from "@nestjs/axios";
import { UserService } from "./../user/user.service";
import { Observable, lastValueFrom, map } from "rxjs";
import { MailService } from "./../email/mail.service";
import { JwtPayload } from "./interfaces/jwt.interface";
import { UserStatusEnum } from "../../common/enums/user-status.enum";
import { RegisterUserDto } from "../user/dtos/register.dto";
import { GoogleRedirectDto } from "./dtos/googleRedirect-auth.dto";
import { RegisterAdminDto } from "./../user/dtos/register.dto";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { RegisterManagerDto } from "./../user/dtos/register.dto";
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
        private readonly emailService: MailService,
        private readonly httpService: HttpService
    ) { }

    async credentialByPassword(email: string, password: string): Promise<any> {
        if (await this.emailService.isCtuetEmail(email)) {
            const user = await this.userService.findByEmail(email)
            if (!user || !user?.password) {
                throw new HttpException("Email or password is incorrect", HttpStatus.NOT_FOUND);
            };
            if (user.status !== UserStatusEnum.ACTIVE) {
                throw new HttpException("Your account not confirmed or blocked!", HttpStatus.UNAUTHORIZED);
            };
            if (!(await bcrypt.compareSync(password, user?.password))) {
                throw new HttpException("Email or password is incorrect", HttpStatus.NOT_FOUND);
            };
            const payload: JwtPayload = {
                id: user.id,
                email: user.email
            };
            return {
                access_token: await this.jwtService.signAsync(payload)
            }
        }
    }

    async ggAccessTokenVerify(accessToken: string): Promise<Observable<AxiosResponse<any, any>>> {
        return lastValueFrom(this.httpService.get(`https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${accessToken}`).pipe(map((res) => res.data)))
    }

    async credentialWithoutPassword(data: GoogleRedirectDto): Promise<any> {
        try {
            const isVerifyToken = await this.ggAccessTokenVerify(data.accessToken).then((res) => res)
            if (isVerifyToken) {
                const isCreated = await this.userService.createWithGoogle(data);
                if (isCreated) {
                    const user = await this.userService.findByEmail(data.email);
                    const payload: JwtPayload = {
                        id: user.id,
                        email: user.email
                    }
                    return {
                        access_token: await this.jwtService.signAsync(payload)
                    }
                }
            }
        } catch (error) {
            throw new HttpException("Your email is not verified or the token is invalid", HttpStatus.BAD_REQUEST)
        }
    }

    async register(user: (RegisterAdminDto | RegisterManagerDto | RegisterUserDto)): Promise<any> {
        return await this.userService.create(user)
    }

}