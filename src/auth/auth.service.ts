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

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly emailService: EmailService
    ) { }

    async credentialByPassword(email: string, password: string): Promise<any> {
        const user = await this.userService.findOne(email)
        if (!user || !user?.password) {
            throw new HttpException("Email or password is incorrect!", HttpStatus.NOT_FOUND)
        }
        if (user.status !== UserStatusEnum.ACTIVE) {
            throw new HttpException("Verify your account before, please!", HttpStatus.UNAUTHORIZED)
        }
        const isCheckPass = await bcrypt.compareSync(password, user?.password);
        if (!isCheckPass) {
            throw new HttpException("Email or password is incorrect!", HttpStatus.NOT_FOUND)
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

    async credentialWithoutPassword(email: string): Promise<any> {
        const user = await this.userService.findOne(email)
        if (user.status !== UserStatusEnum.ACTIVE) {
            throw new HttpException("Verify your account before login, please!", HttpStatus.UNAUTHORIZED)
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
            throw new HttpException("Email not found", HttpStatus.NOT_FOUND)
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
            return false
        }
        const digitalNumbs = Math.floor((100000 + Math.random() * 900000));
        const payload = await this.emailService.sendConfirmationRePassword(email, digitalNumbs.toString());
        const repassToken = await this.jwtService.signAsync(payload);
        await this.userService.updateRepassToken(email, repassToken);
        return true;
    }

    async confirmRePassword(data: ConfirmRePasswordDto) {
        const isExisted = await this.userService.findByEmail(data.email);
        if (!isExisted) {
            throw new HttpException('Email is not register', HttpStatus.NOT_FOUND);
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
                throw new HttpException('The password is duplicated', HttpStatus.NOT_FOUND);
            }
            throw new HttpException('Digital numbers incorrect', HttpStatus.NOT_FOUND);
        } catch (error) {
            return error;
        }
    }
}