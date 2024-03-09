import * as bcrypt from 'bcryptjs'
import { Repository } from "typeorm";
import { UserEntity } from "./user.entity";
import { plainToClass } from "class-transformer";
import { InjectRepository } from "@nestjs/typeorm";
import { UpdateUserDto } from "./dtos/update-user.dto";
import { UpdateAdminDto } from "./dtos/update-admin.dto";
import { RegisterAdminDto } from "./dtos/register-admin.dto";
import { RegisterManagerDto } from "./dtos/register-manager.dto";
import { UserStatusEnum } from "./../auth/enums/user-status.enum";
import { RegisterUserDto } from "./../user/dtos/register-user.dto";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { GoogleRedirectDto } from "./../auth/dtos/googleRedirect-auth.dto";
import { EmailService } from '../email/email.service';
import { RoleEnum } from '../auth/enums/role.enum';
import { JwtService } from '@nestjs/jwt';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { ConfirmationEmailDto } from './dtos/confirmationEmail-auth.dto';
import { EmailLinkConfirmDto } from '../email/dtos/email-confirm.dto';

@Injectable({})
export class UserService {
    constructor(
        private jwtService: JwtService,
        private readonly emailService: EmailService,
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
    async findById(id: number) {
        const user = (await this.userRepository.find({ where: { id: id } }))[0];
        if (user) {
            delete user.token;
            delete user.password;
            delete user.repass_token;
            delete user.refresh_token;
            return user
        }
        throw new HttpException("User not found!", HttpStatus.NOT_FOUND);
    }
    async create(user: (RegisterAdminDto | RegisterManagerDto | RegisterUserDto)) {
        const { email, password, confirmPassword } = user;
        if (await this.emailService.isCtuetEmail(email)) {
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
            await this.emailService.sendConfirmationEmail(newUser.id, newUser.email);
            return "Your account is created successfully!";
        }
    }
    async createWithGoogle(data: GoogleRedirectDto) {
        if (await this.emailService.isCtuetEmail(data.email)) {
            const user = await this.findByEmail(data.email);
            if (user && user.password || user.status == UserStatusEnum.UNACTIVE) {
                throw new HttpException("Email is existed or blocked", HttpStatus.BAD_REQUEST)
            };
            if (!user) {
                let newData = plainToClass(GoogleRedirectDto, data, { excludeExtraneousValues: true });
                const newUser = new UserEntity(newData);
                await this.userRepository.save(newUser);
                await this.disable(newData.email, UserStatusEnum.ACTIVE)
            }
            return true;
        }
    }
    async updateAccountInfo(email: string, data: UpdateUserDto): Promise<any> {
        const user = await this.findByEmail(email);
        if (user && user.status == UserStatusEnum.ACTIVE) {
            const updateInfo = UpdateUserDto.plainToClass(data);
            await this.userRepository.update({ email: email }, updateInfo)
            return updateInfo
        }
        throw new HttpException("User not found or blocked", HttpStatus.NOT_FOUND);
    }
    async update(id: number, data: UpdateAdminDto, email: string): Promise<any> {
        const user = await this.findByEmail(email);
        if (user && user.status == UserStatusEnum.ACTIVE && user.role == RoleEnum.ADMIN) {
            if (await this.findById(id)) {
                const updateInfo = UpdateAdminDto.plainToClass(data)
                await this.userRepository.update({ id: id },
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
            throw new HttpException("Email not found", HttpStatus.BAD_REQUEST);
        };
        throw new HttpException("User not found, bolcked or permission denied!", HttpStatus.NOT_FOUND);
    }
    async updateRepassToken(email: string, repassToken: string) {
        const user = await this.findByEmail(email);
        if (user && user.status == UserStatusEnum.ACTIVE) {
            await this.userRepository.update({ email: email }, { repass_token: repassToken, })
            return true;
        };
        throw new HttpException('User not found or blocked', HttpStatus.NOT_FOUND);
    }
    async updatePassword(email: string, password: string) {
        const user = await this.findByEmail(email);
        if (user && user.status == UserStatusEnum.ACTIVE) {
            await this.userRepository.update({ email: email }, { password: password })
            return "Your password updated!"
        };
        throw new HttpException('User not found or blocked', HttpStatus.NOT_FOUND);
    }
    async userConfirmation(dto: ConfirmationEmailDto) {
        const email = await this.emailService.confirmEmail(dto);
        if (email) {
            const user = await this.findByEmail(email);
            if (user.status == UserStatusEnum.UNACTIVE) {
                await this.disable(email, UserStatusEnum.ACTIVE);
                await this.userRepository.update({ email: email }, { refresh_token: null, })
                return "Your account is confirmation!"
            }
            throw new HttpException("The email is confirmeation!", HttpStatus.ACCEPTED)
        }
    }
    async confirmRePassword(data: ForgotPasswordDto) {
        const isExisted = await this.findByEmail(data.email);
        if (!isExisted || !isExisted.password || isExisted.status == UserStatusEnum.UNACTIVE) {
            throw new HttpException('Email not found or blocked!', HttpStatus.NOT_FOUND);
        }
        try {
            const decoded = await this.jwtService.verifyAsync(isExisted.repass_token)
            if (data.digitalNumbs === decoded.digitalNumbs) {
                const isCheckPass = await bcrypt.compareSync(data.password, isExisted.password);
                if (!isCheckPass) {
                    const password = await bcrypt.hashSync(data.password, 10);
                    await this.updatePassword(data.email, password);
                    return "Your password is already updated";
                }
                throw new HttpException('The password is duplicated', HttpStatus.BAD_REQUEST);
            }
            throw new HttpException('Digital numbers incorrect', HttpStatus.BAD_REQUEST);
        } catch (error) {
            return error;
        }
    }
    async resetPassword(email: string): Promise<any> {
        const isExisted = await this.findByEmail(email);
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
            await this.updateRepassToken(email, repassToken);
            return "The new digital numbers was send to your Email!";
        }
    }
    async disable(email: string, status: UserStatusEnum) {
        if (await this.findByEmail(email)) {
            await this.userRepository.update({ email: email }, { status: status })
            return true
        }
        throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
    }
    async getAccountInfo(email: string): Promise<any> {
        let user = await this.findByEmail(email)
        if (!user || user.status == UserStatusEnum.UNACTIVE) {
            throw new HttpException("Email not found or blocked", HttpStatus.NOT_FOUND)
        }
        delete user.token;
        delete user.refresh_token;
        delete user.password;
        delete user.repass_token;
        return user
    }
    async resendConfirmationLink(dto: EmailLinkConfirmDto) {
        const user = await this.findByEmail(dto.email);
        if (user) {
            if (user.status == UserStatusEnum.UNACTIVE) {
                try {
                    const decode = await this.emailService.decodeConfirmationToken(user.refresh_token);
                    if (decode) {
                        return "Please, click the link was send to your account before!"
                    }
                } catch (error: any) {
                    const token = await this.emailService.sendConfirmationEmail(user.id, user.email);
                    await this.userRepository.update({ email: dto.email }, { refresh_token: token })
                    return "The confirmation email link already send";
                }
            }
            throw new HttpException("Your account is confirmed!", HttpStatus.ACCEPTED);
        }
        throw new HttpException("User not found!", HttpStatus.BAD_REQUEST);
    }
}