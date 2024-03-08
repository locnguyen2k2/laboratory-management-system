import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "src/user/user.service";
import { RegisterUserDto } from "../user/dtos/register-user.dto";
import * as bcrypt from 'bcryptjs'
import { JwtPayload } from "./interfaces/jwt.interface";
import { UserStatusEnum } from "./enums/user-status.enum";
import { RegisterAdminDto } from "src/user/dtos/register-admin.dto";
import { RegisterManagerDto } from "src/user/dtos/register-manager.dto";
import { EmailService } from "src/email/email.service";
import { ConfirmRePasswordDto } from "./dtos/confirm-repassword.dto";
import { HttpService } from "@nestjs/axios";
import { Observable, lastValueFrom, map } from "rxjs";
import { AxiosResponse } from "axios";
import { GoogleRedirectDto } from "./dtos/googleRedirect-auth.dto";

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private jwtService: JwtService,
        private readonly emailService: EmailService,
        private readonly httpService: HttpService
    ) { }

    async credentialByPassword(email: string, password: string): Promise<any> {
        if (await this.emailService.isCtuetEmail(email)) {
            const user = await this.userService.findByEmail(email)
            if (!user || !user?.password) {
                throw new HttpException("Email or password is incorrect", HttpStatus.NOT_FOUND);
            };
            if (user.status !== UserStatusEnum.ACTIVE) {
                throw new HttpException("Verify your account before, please!", HttpStatus.UNAUTHORIZED)
            }
            if (!(await bcrypt.compareSync(password, user?.password))) {
                throw new HttpException("Email or password is incorrect", HttpStatus.NOT_FOUND)
            }
            const payload: JwtPayload = {
                id: user.id,
                email: user.email
            }
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
                if (await this.emailService.isCtuetEmail(data.email)) {
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
            }
        } catch (error) {
            throw new HttpException("Your email is not verified or the token is invalid", HttpStatus.BAD_REQUEST)
        }
    }

    async register(user: (RegisterAdminDto | RegisterManagerDto | RegisterUserDto)): Promise<any> {
        if (await this.emailService.isCtuetEmail(user.email)) {
            if (await this.userService.create(user)) {
                await this.emailService.sendConfirmationEmail(user.email);
                return 'Confirmation your email by click the link was send to your email';
            };
        }
    }

    async getInfoByEmail(email: string): Promise<any> {
        let user = await this.userService.findByEmail(email)
        if (!user || user.status == UserStatusEnum.UNACTIVE) {
            throw new HttpException("Email not found or blocked", HttpStatus.NOT_FOUND)
        }
        delete user.token;
        delete user.refresh_token;
        delete user.password;
        delete user.repass_token;
        return user
    }

    async disable(email: string, status: UserStatusEnum): Promise<any> {
        return await this.userService.disable(email, status)
    }

    async resetPassword(email: string): Promise<any> {
        const isExisted = await this.userService.findByEmail(email);
        if (!isExisted || !isExisted.password || isExisted.status == UserStatusEnum.UNACTIVE) {
            throw new HttpException("Email not found or blocked!", HttpStatus.NOT_FOUND)
        };
        try {
            const decoded = await this.jwtService.verifyAsync(isExisted.repass_token);
            if (decoded) {
                return "Please, check your digital numbers in your email before!";
            };
        } catch (error) {
            const digitalNumbs = Math.floor((100000 + Math.random() * 900000));
            const payload = await this.emailService.sendConfirmationRePassword(email, digitalNumbs.toString());
            const repassToken = await this.jwtService.signAsync(payload);
            await this.userService.updateRepassToken(email, repassToken);
            return "The new digital numbers was send to your Email!";
        }
    }

    async confirmRePassword(data: ConfirmRePasswordDto) {
        const isExisted = await this.userService.findByEmail(data.email);
        if (!isExisted || !isExisted.password || isExisted.status == UserStatusEnum.UNACTIVE) {
            throw new HttpException('Email not found or blocked!', HttpStatus.NOT_FOUND);
        }
        try {
            const decoded = await this.jwtService.verifyAsync(isExisted.repass_token)
            if (data.digitalNumbs === decoded.digitalNumbs) {
                const isCheckPass = await bcrypt.compareSync(data.password, isExisted.password);
                if (!isCheckPass) {
                    const password = await bcrypt.hashSync(data.password, 10);
                    await this.userService.updatePassword(data.email, password);
                    return "Your password is already updated";
                }
                throw new HttpException('The password is duplicated', HttpStatus.BAD_REQUEST);
            }
            throw new HttpException('Digital numbers incorrect', HttpStatus.BAD_REQUEST);
        } catch (error) {
            return error;
        }
    }
}