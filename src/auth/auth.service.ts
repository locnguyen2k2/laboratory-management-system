import { Injectable, NotAcceptableException, Post, Request, UseGuards } from "@nestjs/common";
import * as bcrypt from 'bcryptjs'
import { JwtService } from "@nestjs/jwt";
import { UserService } from "src/user/user.service";
import { RegisterAuthDto } from "./dtos/register-auth.dto";

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private jwtService: JwtService
    ) { }

    // Tested
    async validateUser(email: string, password: string): Promise<boolean> {
        return await this.userService.checkLogin(email, password)
    }

    // Tested
    async login(email: string, password: string): Promise<any> {
        const isCheck = await this.userService.emailCheck(email)
        if (isCheck) {
            if (await this.userService.checkLogin(email, password)) {
                const user = await this.userService.getUserByEmail(email)[0];
                const payload = {
                    id: user.id,
                    email: user.email,
                    fullName: user.firstName + ' ' + user.lastName,
                }
                const access_token = this.jwtService.sign(payload)
                return access_token
            }
            return false
        }
        return false
    }

    // Tested
    async register(user: RegisterAuthDto): Promise<boolean> {
        return await this.userService.createUser(user)
    }
}