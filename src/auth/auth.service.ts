import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "src/user/user.service";
import { RegisterUserDto } from "../user/dtos/register-user.dto";
import * as bcrypt from 'bcryptjs'
import { JwtPayload } from "./interfaces/jwt.interface";
import { UserStatusEnum } from "./enums/user-status.enum";

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private jwtService: JwtService
    ) { }

    async credentialByPassword(email: string, password: string): Promise<any> {
        const user = await this.userService.findOne(email)
        console.log('oke')
        if (!user) {
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

    async register(user: RegisterUserDto): Promise<boolean> {
        return await this.userService.create(user)
    }

    async getUserByEmail(email: string): Promise<any> {
        let user = await this.userService.findByEmail(email)
        delete user.token;
        delete user.refresh_token;
        delete user.password;
        return user
    }
}