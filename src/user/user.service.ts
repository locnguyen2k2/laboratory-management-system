import { Injectable, NotAcceptableException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "./entities/user.entity";
import { Admin, EntityManager, Repository } from "typeorm";
import { RegisterUserDto } from "src/user/dtos/register-user.dto";
import { plainToClass } from "class-transformer";
import * as bcrypt from 'bcryptjs'
import { JwtPayload } from "src/auth/interfaces/jwt.interface";
import { RegisterAdminDto } from "./dtos/register-admin.dto";

@Injectable({})
export class UserService {
    constructor(
        private readonly userManager: EntityManager,
        @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>
    ) { }

    async findAll() {
        return await this.userRepository.find()
    }

    async findOne(email: string) {
        return (await this.userRepository.find({ where: { email: email } }))[0]
    }

    async findByEmail(email: string) {
        return (await this.userRepository.find({ where: { email: email } }))[0]
    }

    async create(user: RegisterUserDto) {
        const { email, password, confirmPassword } = user;
        const isExisted = await this.findByEmail(email);
        if (isExisted || password !== confirmPassword) { return false }
        let data = plainToClass(RegisterUserDto, user, { excludeExtraneousValues: true });
        data.password = await bcrypt.hashSync(data.password, 10);
        const newUser = new UserEntity(data);
        await this.userRepository.save(newUser);
        return true
    }
}