import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "src/user/user.service";
import { RegisterUserDto } from "../user/dtos/register-user.dto";
import * as bcrypt from 'bcryptjs'
import { JwtPayload } from "./interfaces/jwt.interface";
import { UserStatusEnum } from "./enums/user-status.enum";
import { RegisterAdminDto } from "src/user/dtos/register-admin.dto";
import { RegisterManagerDto } from "src/user/dtos/register-manager.dto";
import { ConfigService } from "@nestjs/config";
import { EmailService } from "src/email/email.service";
import { ConfirmRePasswordDto } from "./dtos/confirm-repassword.dto";
import { HttpService } from "@nestjs/axios";
import { Observable, lastValueFrom, map } from "rxjs";
import { AxiosResponse } from "axios";

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly emailService: EmailService,
        private readonly httpService: HttpService
    ) { }

    async credentialByPassword(email: string, password: string): Promise<any> {
        const user = await this.userService.findByEmail(email)
        if (!user || !user?.password) {
            throw new HttpException({ message: "Email or password is incorrect", statusCode: 404 }, HttpStatus.ACCEPTED)
        }
        if (user.status !== UserStatusEnum.ACTIVE) {
            throw new HttpException({ message: "Verify your account before, please!", statusCode: 404 }, HttpStatus.ACCEPTED)
        }
        const isCheckPass = await bcrypt.compareSync(password, user?.password);
        if (!isCheckPass) {
            throw new HttpException({ message: "Email or password is incorrect!", statusCode: 404 }, HttpStatus.ACCEPTED)
        }
        const payload: JwtPayload = {
            id: user.id,
            email: user.email
        }
        const access_token = await this.jwtService.signAsync(payload)

        return {
            access_token: access_token
        }
    }

    async isCtuetEmail(email: string): Promise<boolean> {
        const emailHandle = email.split('@')[1];
        const isEmailCTUET = emailHandle.includes('ctuet.edu.vn');
        if (!isEmailCTUET) {
            return false;
        }
        return true;
    }

    async ggAccessTokenVerify(accessToken: string): Promise<Observable<AxiosResponse<any, any>>> {
        return lastValueFrom(this.httpService.get(`https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${accessToken}`).pipe(map((res) => res.data)))
    }

    async credentialWithoutPassword(email: string): Promise<any> {
        const user = await this.userService.findByEmail(email)
        if (user.status !== UserStatusEnum.ACTIVE) {
            throw new HttpException({ message: "Verify your account before login, please!", statusCode: 404 }, HttpStatus.ACCEPTED)
        }
        const payload: JwtPayload = {
            id: user.id,
            email: user.email
        }
        const access_token = await this.jwtService.signAsync(payload)

        return {
            access_token: access_token
        }
    }

    async register(user: (RegisterAdminDto | RegisterManagerDto | RegisterUserDto)): Promise<boolean> {
        const create = await this.userService.create(user);
        if (create) {
            await this.emailService.sendConfirmationEmail(user.email);
        }
        return create
    }

    async getUserByEmail(email: string): Promise<any> {
        let user = await this.userService.findByEmail(email)
        if (!user) {
            throw new HttpException({ message: "Email not found", statusCode: 404 }, HttpStatus.ACCEPTED)
        }
        delete user.token;
        delete user.refresh_token;
        delete user.password;
        return user
    }

    async disable(email: string, status: UserStatusEnum): Promise<any> {
        return await this.userService.disable(email, status)
    }

    async resetPassword(email: string): Promise<any> {
        const isExisted = await this.userService.findByEmail(email);
        if (!isExisted || !isExisted.password) {
            throw new HttpException({ message: "Email not found or not yet register!", statusCode: 404 }, HttpStatus.ACCEPTED)
        }
        try {
            const decoded = await this.jwtService.verifyAsync(isExisted.repass_token);
            if (decoded) {
                throw new HttpException({ message: "Please, check your digital numbers in your email before!", status: 404 }, HttpStatus.ACCEPTED)
            }
        } catch (error) {
            const digitalNumbs = Math.floor((100000 + Math.random() * 900000));
            const payload = await this.emailService.sendConfirmationRePassword(email, digitalNumbs.toString());
            const repassToken = await this.jwtService.signAsync(payload);
            await this.userService.updateRepassToken(email, repassToken);
            throw new HttpException("The new digital numbers was send to your Email!", HttpStatus.ACCEPTED)
        }
    }

    async confirmRePassword(data: ConfirmRePasswordDto) {
        const isExisted = await this.userService.findByEmail(data.email);
        if (!isExisted) {
            throw new HttpException({ message: 'Email is not register', statusCode: 404 }, HttpStatus.ACCEPTED);
        }
        try {
            const decoded = await this.jwtService.verifyAsync(isExisted.repass_token)
            if (data.digitalNumbs === decoded.digitalNumbs) {
                const isCheckPass = await bcrypt.compareSync(data.password, isExisted.password);
                if (!isCheckPass) {
                    const password = await bcrypt.hashSync(data.password, 10);
                    await this.userService.updatePassword(data.email, password);
                    throw new HttpException('Your password is updated!', HttpStatus.ACCEPTED);
                }
                throw new HttpException({ message: 'The password is duplicated', statusCode: 404 }, HttpStatus.ACCEPTED);
            }
            throw new HttpException({ message: 'Digital numbers incorrect', statusCode: 404 }, HttpStatus.ACCEPTED);
        } catch (error) {
            return error;
        }
    }
}