import { Injectable, NotAcceptableException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "./entities/user.entity";
import { EntityManager, Repository } from "typeorm";
import { RegisterAuthDto } from "src/auth/dtos/register-auth.dto";
import { plainToClass } from "class-transformer";
import * as bcrypt from 'bcryptjs'

@Injectable({})
export class UserService {
    constructor(
        private readonly userManager: EntityManager,
        @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>
    ) { }

    // Tested
    async emailCheck(email: string): Promise<boolean> {
        return (await this.userRepository.find({ where: { email: email } })).length > 0 ? true : false
    }

    // Tested
    async checkLogin(email: string, password: string): Promise<boolean> {
        const isExisted = await this.emailCheck(email)
        if (isExisted) {
            let user = await this.userRepository.find({ where: { email: email } });
            return await bcrypt.compareSync(password, user[0].password) ? true : false;
        }
        return false
    }

    async getUserByEmail(email: string): Promise<any> {
        return await this.userRepository.find({ where: { email: email } })
    }

    async createUser(user: RegisterAuthDto): Promise<boolean> {
        const { email, password, confirmPassword } = user
        const isExisted = await this.emailCheck(email)
        if (isExisted || password !== confirmPassword) { return false }
        let data = plainToClass(RegisterAuthDto, user, { excludeExtraneousValues: true });
        data.password = await bcrypt.hashSync(data.password, 10)
        const newUser = new UserEntity(data)
        await this.userRepository.save(newUser)
        return true
    }
}