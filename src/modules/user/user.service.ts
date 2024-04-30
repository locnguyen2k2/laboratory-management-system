import * as bcrypt from 'bcryptjs'
import { Repository } from "typeorm";
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from "./user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { UpdateAdminDto } from "./dtos/update.dto";
import { MailService } from '../email/mail.service';
import { UserStatus } from "./user.constant";
import { ForgotPasswordDto, PasswordUpdateDto } from './dtos/password.dto';
import { EmailLinkConfirmDto } from '../email/dtos/email-confirm.dto';
import { UpdateUserDto } from "./dtos/update.dto";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConfirmationEmailDto } from './dtos/confirmationEmail-auth.dto';
import { GoogleRedirectDto } from "./../auth/dtos/googleRedirect-auth.dto";
import { AccountInfo } from './interfaces/AccountInfo.interface';
import { ErrorEnum } from 'src/constants/error-code.constant';
import { BusinessException } from 'src/common/exceptions/biz.exception';
import { Credential } from '../auth/interfaces/credential.interface';
import { JwtPayload } from '../auth/interfaces/jwt.interface';
import { RoleEnum } from 'src/enums/role-enum.enum';

@Injectable({})
export class UserService {
    constructor(
        private jwtService: JwtService,
        private readonly emailService: MailService,
        @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
    ) { }

    async findAll(): Promise<UserEntity[]> {
        return await this.userRepository.createQueryBuilder('user')
            .getMany();
    }
    async findByEmail(email: string): Promise<UserEntity> {
        const user = await this.userRepository.createQueryBuilder('user')
            .where({ email: email })
            .getOne()
        if (user)
            return user
    }
    async findById(id: number): Promise<UserEntity> {
        const user = await this.userRepository
            .createQueryBuilder('user')
            .where({ id: id })
            .getOne()
        if (user)
            return user
        throw new BusinessException(ErrorEnum.USER_NOT_FOUND)
    }
    async updateAccountInfo(id: number, data: UpdateUserDto): Promise<AccountInfo> {
        if (await this.findById(id)) {
            const user = await this.findById(id);
            const info = {
                ...data,
                ...(data.firstName ? { firstName: data.firstName } : { firstName: user.firstName }),
                ...(data.lastName ? { lastName: data.lastName } : { lastName: user.lastName }),
                ...(data.address ? { address: data.address } : { address: user.address }),
            }
            if (user.status == UserStatus.ACTIVE) {
                await this.userRepository.update({ id: id }, info)
                return await this.getAccountInfo(user.email);
            }
            throw new BusinessException(ErrorEnum.USER_IS_BLOCKED);
        }
    }
    async update(id: number, dto: UpdateAdminDto): Promise<UserEntity> {
        const data = UpdateAdminDto.plainToClass(dto);
        if (await this.findById(id)) {
            const user = await this.findById(id);
            const info = {
                ...data,
                ...(data.firstName ? { firstName: data.firstName } : { firstName: user.firstName }),
                ...(data.photo && data.photo.length > 0 ? { photo: data.photo } : { photo: user.photo }),
                ...(data.lastName ? { lastName: data.lastName } : { lastName: user.lastName }),
                ...(data.address ? { address: data.address } : { address: user.address }),
                ...(data.status >= 0 ? { status: data.status } : { status: user.status }),
                ...(data.role ? { role: data.role } : { role: user.role }),
            }
            await this.userRepository.update({ id: id },
                {
                    firstName: info.firstName,
                    lastName: info.lastName,
                    address: info.address,
                    status: info.status,
                    photo: info.photo,
                    role: info.role
                })
            return await this.findById(id);
        }
    }
    async create(user: any): Promise<any> {
        const { email, password, confirmPassword } = user;
        if (await this.emailService.isCtuetEmail(email)) {
            const isExisted = await this.findByEmail(email);
            if (isExisted && isExisted.password) {
                throw new BusinessException(ErrorEnum.USER_EXISTS);
            };
            if (password !== confirmPassword) {
                throw new BusinessException(ErrorEnum.PASSWORD_VERIFICATION_FAILED);
            };
            delete user.confirmPassword;
            const newPassword = await bcrypt.hashSync(user.password, 10);
            if (isExisted) {
                await this.userRepository.update({ id: isExisted.id }, { password: newPassword, status: UserStatus.UNACTIVE })
                const refresh_token = await this.emailService.sendConfirmationEmail(isExisted.id, isExisted.email);
                await this.userRepository.update({ email: isExisted.email }, { refresh_token })
                throw new BusinessException("Confirm your account by the link was send to your email!");
            }
            user.password = newPassword;
            const newUser = new UserEntity(user);
            await this.userRepository.save(newUser);
            if (!(user.role)) {
                const refresh_token = await this.emailService.sendConfirmationEmail(newUser.id, newUser.email);
                await this.userRepository.update({ email: email }, { refresh_token })
                throw new BusinessException("Confirm your account by the link was send to your email!");
            }
            await this.update(newUser.id, { ...newUser, status: UserStatus.ACTIVE })
            return await this.findById(newUser.id)
        }
    }
    async createWithGoogle(data: GoogleRedirectDto): Promise<Credential> {
        const { email } = data;
        if (await this.emailService.isCtuetEmail(email)) {
            const user = await this.findByEmail(email);
            if (user?.status == UserStatus.DISABLE) {
                throw new BusinessException(ErrorEnum.USER_IS_BLOCKED)
            };
            if (user?.status == UserStatus.UNACTIVE) {
                delete user.status;
                await this.update(user.id, { ...user, status: UserStatus.ACTIVE })
            } else if (!user) {
                delete data.accessToken;
                const newUser = new UserEntity(data);
                await this.userRepository.save(newUser);
                await this.update(newUser.id, { ...user, status: UserStatus.ACTIVE })
            }
            const userInfo = await this.findByEmail(email);
            const newUser = await this.findByEmail(email);
            try {
                if (await this.jwtService.verifyAsync(newUser.token)) {
                    return {
                        userInfo,
                        access_token: newUser.token
                    }
                }
            } catch (error: any) {
                const payload: JwtPayload = {
                    id: newUser.id,
                    email: newUser.email
                }
                const access_token = await this.jwtService.signAsync(payload);
                await this.updateToken(payload.email, access_token);
                return {
                    userInfo,
                    access_token
                }
            }
        }
    }
    async updateToken(email: string, access_token: string): Promise<Boolean> {
        const user = await this.findByEmail(email);
        if (user) {
            await this.userRepository.update({ id: user.id }, {
                token: access_token
            })
            return true;
        }
        return false
    }
    async updateRepassToken(email: string, repassToken: string) {
        const user = await this.findByEmail(email);
        if (!user || !user.password || user.status !== UserStatus.ACTIVE) {
            throw new BusinessException(ErrorEnum.USER_INVALID);
        }
        await this.userRepository.update({ email: email }, { repass_token: repassToken })
        return true;
    }
    async updatePassword(email: string, password: string) {
        await this.userRepository.update({ email: email }, { password: password, repass_token: null })
    }
    async userConfirmation(dto: ConfirmationEmailDto) {
        const email = await this.emailService.confirmEmail(dto);
        if (email) {
            const user = await this.findByEmail(email);
            if (user.status == UserStatus.DISABLE)
                throw new BusinessException(ErrorEnum.USER_IS_BLOCKED);
            if (user.status == UserStatus.UNACTIVE) {
                await this.update(user.id, { ...user, status: UserStatus.ACTIVE });
                await this.userRepository.update({ email: email }, { refresh_token: null, })
                throw new BusinessException("Confirmation email is successful")
            }
            throw new BusinessException("This email is confirmed!")
        }
    }
    async confirmRePassword(data: ForgotPasswordDto) {
        const isExisted = await this.findByEmail(data.email);
        if (!isExisted || !isExisted.password || isExisted.status !== UserStatus.ACTIVE) {
            throw new BusinessException(ErrorEnum.USER_INVALID);
        }
        try {
            await this.jwtService.verifyAsync(isExisted.repass_token)
        } catch (error) {
            throw new BusinessException(ErrorEnum.INVALID_VERIFICATION_TOKEN)
        }
        const decoded = await this.jwtService.verifyAsync(isExisted.repass_token)
        if (data.digitalNumbs === decoded.digitalNumbs) {
            const isCheckPass = await bcrypt.compareSync(data.password, isExisted.password);
            if (!isCheckPass) {
                const password = await bcrypt.hashSync(data.password, 10);
                await this.updatePassword(data.email, password);
                return ("Your password is already updated");
            }
            throw new HttpException('The password is duplicated', HttpStatus.BAD_REQUEST);
        }
        throw new HttpException('Digital numbers incorrect', HttpStatus.BAD_REQUEST);
    }
    async forgotPassword(email: string): Promise<any> {
        const isExisted = await this.findByEmail(email);
        if (!isExisted || isExisted.status !== UserStatus.ACTIVE) {
            throw new BusinessException(ErrorEnum.USER_INVALID)
        };
        try {
            await this.jwtService.verifyAsync(isExisted.repass_token);
        } catch (error) {
            const digitalNumbs = Math.floor((100000 + Math.random() * 900000));
            const payload = await this.emailService.sendConfirmationRePassword(email, digitalNumbs.toString());
            const repassToken = await this.jwtService.signAsync(payload);
            await this.updateRepassToken(email, repassToken);
            throw new BusinessException("The new digital numbers was send to your Email!");
        }
        const decoded = await this.jwtService.verifyAsync(isExisted.repass_token);
        if (decoded) {
            throw new BusinessException("Please, check your digital numbers in your email before!");
        };
    }
    async getAccountInfo(email: string): Promise<AccountInfo> {
        let user = await this.findByEmail(email)
        if (!user || user.status == UserStatus.DISABLE) {
            throw new BusinessException(ErrorEnum.USER_IS_BLOCKED)
        }
        if (user.status == UserStatus.UNACTIVE) {
            throw new BusinessException(ErrorEnum.USER_UNCONFIRMED)
        }
        delete user.token;
        delete user.refresh_token;
        delete user.password;
        delete user.repass_token;
        return user
    }
    async resendConfirmationLink(dto: EmailLinkConfirmDto) {
        const user = await this.findByEmail(dto.email);
        if (user && user.status !== UserStatus.DISABLE) {
            if (user.status == UserStatus.UNACTIVE) {
                try {
                    await this.emailService.decodeConfirmationToken(user.refresh_token);
                } catch (error: any) {
                    const token = await this.emailService.sendConfirmationEmail(user.id, user.email);
                    await this.userRepository.update({ email: dto.email }, { refresh_token: token })
                    throw new BusinessException("The confirmation email link already send");
                }
                const decode = await this.emailService.decodeConfirmationToken(user.refresh_token);
                if (decode) {
                    throw new BusinessException("Please, click the link was send to your account before!")
                }
            }
            throw new BusinessException("Your account is confirmed!");
        }
        throw new BusinessException(ErrorEnum.USER_INVALID);
    }
    async resetPassword(id: number, data: PasswordUpdateDto) {
        const user = await this.findById(id);
        const isTrue = await bcrypt.compareSync(data.oldPassword, user.password)
        if (isTrue) {
            const newPassword = await bcrypt.hashSync(data.newPassword, 10);
            await this.userRepository.update(id, { password: newPassword })
            throw new BusinessException("The password is changed")
        }
        throw new BusinessException("400:Old password is incorrect!")
    }
}