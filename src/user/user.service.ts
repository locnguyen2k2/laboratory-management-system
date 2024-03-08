import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "./entities/user.entity";
import { Repository } from "typeorm";
import { RegisterUserDto } from "src/user/dtos/register-user.dto";
import { plainToClass } from "class-transformer";
import * as bcrypt from 'bcryptjs'
import { RegisterAdminDto } from "./dtos/register-admin.dto";
import { RegisterManagerDto } from "./dtos/register-manager.dto";
import { UpdateUserDto } from "./dtos/update-user.dto";
import { UpdateAdminDto } from "./dtos/update-admin.dto";
import { UserStatusEnum } from "src/auth/enums/user-status.enum";
import { GoogleRedirectDto } from "src/auth/dtos/googleRedirect-auth.dto";

@Injectable({})
export class UserService {
    constructor(
        @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
    ) { }

    async findAll() {
        let listUser = await this.userRepository.find();
        listUser.forEach((item: any) => {
            delete item.password,
                delete item.token,
                delete item.repass_token,
                delete item.refresh_token;
        })
        return listUser;
    }

    async findByEmail(email: string) {
        return (await this.userRepository.find({ where: { email: email } }))[0]
    }

    async create(user: (RegisterAdminDto | RegisterManagerDto | RegisterUserDto)) {
        const { email, password, confirmPassword } = user;
        const isExisted = await this.findByEmail(email);
        if (isExisted) {
            throw new HttpException('This email address is already used', HttpStatus.BAD_REQUEST);
        };
        if (password !== confirmPassword) {
            throw new HttpException('Confirmation password does not match', HttpStatus.BAD_REQUEST);
        };
        delete user.confirmPassword;
        user.password = await bcrypt.hashSync(user.password, 10);
        const newUser = new UserEntity(user);
        await this.userRepository.save(newUser);
        return true;
    }

    async createWithGoogle(user: GoogleRedirectDto) {
        const isExisted = await this.findByEmail(user.email);
        if (isExisted && isExisted.password || isExisted.status == UserStatusEnum.UNACTIVE) {
            throw new HttpException("Email is existed or blocked", HttpStatus.BAD_REQUEST)
        };
        if (!isExisted) {
            let data = plainToClass(GoogleRedirectDto, user, { excludeExtraneousValues: true });
            const newUser = new UserEntity(data);
            await this.userRepository.save(newUser);
            await this.disable(data.email, UserStatusEnum.ACTIVE)
        }
        return true;
    }

    async update(email: string, user: UpdateUserDto): Promise<any> {
        const updateInfo = UpdateUserDto.plainToClass(user);
        await this.userRepository.update({ email: email }, updateInfo)
        return updateInfo
    }

    async updateAdmin(email: string, user: UpdateAdminDto): Promise<any> {
        if (!(await this.findByEmail(user.email))) {
            throw new HttpException("Email not found", HttpStatus.NOT_FOUND);
        };
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
        return updateInfo;
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
        throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
    }
}