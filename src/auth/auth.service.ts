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

        return {
            access_token: await this.jwtService.signAsync(payload)
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
        return {
            access_token: await this.jwtService.signAsync(payload)
        }
    }

    async registerUser(user: RegisterUserDto): Promise<boolean> {
        const create = await this.userService.create(user);
        if (create) {
            await this.emailService.sendConfirmationEmail(user.email);
        }
        return create;
    }

    async registerManager(user: RegisterManagerDto): Promise<boolean> {
        return await this.userService.createManager(user)
    }

    async registerAdmin(user: RegisterAdminDto): Promise<boolean> {
        return await this.userService.createAdmin(user)
    }

    async getUserByEmail(email: string): Promise<any> {
        let user = await this.userService.findByEmail(email)
        delete user.token;
        delete user.refresh_token;
        delete user.password;
        return user
    }

    async disable(email: string, status: UserStatusEnum): Promise<any> {
        return await this.userService.disable(email, status)
    }

}