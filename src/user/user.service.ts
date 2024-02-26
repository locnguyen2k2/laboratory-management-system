import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "./entities/user.entity";
import { EntityManager, Repository } from "typeorm";
import { RegisterUserDto } from "src/user/dtos/register-user.dto";
import { plainToClass } from "class-transformer";
import * as bcrypt from 'bcryptjs'
import { RegisterAdminDto } from "./dtos/register-admin.dto";
import { RegisterManagerDto } from "./dtos/register-manager.dto";
import { UpdateUserDto } from "./dtos/update-user.dto";
import { UpdateAdminDto } from "./dtos/update-admin.dto";
import { UserStatusEnum } from "src/auth/enums/user-status.enum";

@Injectable({})
export class UserService {
    constructor(
        private readonly userManager: EntityManager,
        @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
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



    async create(user: any) {
        const { email, password, confirmPassword } = user;
        const isExisted = await this.findByEmail(email);
        if (isExisted || password !== confirmPassword) {
            return false
        }
        const newUser = new UserEntity(user);
        await this.userRepository.save(newUser);
        return true
    }

    async createWithEmail(user: any) {
        const { email } = user;
        const isExisted = await this.findByEmail(email);
        if (isExisted) { return false }
        let data = plainToClass(RegisterUserDto, user, { excludeExtraneousValues: true });
        const newUser = new UserEntity(data);
        await this.userRepository.save(newUser);
        return true
    }

    async update(email: string, user: UpdateUserDto): Promise<any> {
        const updateInfo = UpdateUserDto.plainToClass(user);
        await this.userRepository.update({ email: email }, updateInfo)
        return updateInfo
    }

    async updateAdmin(email: string, user: UpdateAdminDto): Promise<any> {
        const isCheck = await this.findByEmail(user.email)
        if (!isCheck) {
            throw new HttpException("User not found", HttpStatus.NOT_FOUND)
        }
        const updateInfo = UpdateAdminDto.plainToClass(user)
        await this.userRepository.update({ email: updateInfo.email },
            {
                firstName: updateInfo.firstName,
                lastName: updateInfo.lastName,
                phone: updateInfo.phone,
                address: updateInfo.address,
                status: updateInfo.status,
                role: updateInfo.role,
            })
        throw new HttpException("User is updated!", HttpStatus.ACCEPTED)
    }

    async updateRepassToken(email: string, repassToken: string) {
        return await this.userRepository.update({ email: email },
            {
                repass_token: repassToken,
            })
    }

    async updatePassword(email: string, password: string) {
        return await this.userRepository.update({ email: email },
            {
                password: password,
            })
    }

    async disable(email: string, status: UserStatusEnum) {
        if (await this.findByEmail(email)) {
            await this.userRepository.update({ email: email }, { status: status })
            return true
        }
        return false
    }
}