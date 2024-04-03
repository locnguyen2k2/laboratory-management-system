import * as bcrypt from 'bcryptjs'
import { Repository } from "typeorm";
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from "./user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { UpdateAdminDto } from "./dtos/update.dto";
import { MailService } from '../email/mail.service';
import { UserRole, UserStatus } from "./user.constant";
import { ForgotPasswordDto } from './dtos/password.dto';
import { RoleService } from '../role/role.service';
import { EmailLinkConfirmDto } from '../email/dtos/email-confirm.dto';
import { UpdatePermissionDto, UpdateUserDto } from "./dtos/update.dto";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConfirmationEmailDto } from './dtos/confirmationEmail-auth.dto';
import { GoogleRedirectDto } from "./../auth/dtos/googleRedirect-auth.dto";
import { AccountInfo } from './interfaces/AccountInfo.interface';
import { ErrorEnum } from 'src/constants/error-code.constant';
import { BusinessException } from 'src/common/exceptions/biz.exception';
import { AddPermissionDto } from './dtos/add-permission.dto';
import { Credential } from '../auth/interfaces/credential.interface';
import { JwtPayload } from '../auth/interfaces/jwt.interface';

@Injectable({})
export class UserService {
    constructor(
        private jwtService: JwtService,
        private readonly roleService: RoleService,
        private readonly emailService: MailService,
        @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
    ) { }
    async findAll(): Promise<UserEntity[]> {
        return await this.userRepository.
            createQueryBuilder('user')
            .leftJoinAndSelect('user.roles', 'roles')
            .getMany();
    }
    async findByEmail(email: string): Promise<UserEntity> {
        const user = await this.userRepository
            .createQueryBuilder('user')
            .where({ email: email })
            .leftJoinAndSelect('user.roles', 'roles')
            .getOne()
        if (user)
            return user
    }
    async findById(id: number): Promise<UserEntity> {
        const user = await this.userRepository
            .createQueryBuilder('user')
            .where({ id: id })
            .leftJoinAndSelect('user.roles', 'roles')
            .getOne()
        if (user)
            return user
        throw new BusinessException(ErrorEnum.USER_NOT_FOUND)
    }
    async create(user: any): Promise<AccountInfo> {
        const { email, password, confirmPassword } = user;
        if (await this.emailService.isCtuetEmail(email)) {
            const isExisted = await this.findByEmail(email);
            if (isExisted) {
                throw new BusinessException(ErrorEnum.USER_EXISTS);
            };
            if (password !== confirmPassword) {
                throw new BusinessException(ErrorEnum.PASSWORD_VERIFICATION_FAILED);
            };
            delete user.confirmPassword;
            user.password = await bcrypt.hashSync(user.password, 10);
            const roles = user.roles != undefined ? user.roles : 2;
            delete user.roles;
            try {
                const newUser = new UserEntity(user);
                await this.userRepository.save(newUser);
                await this.userRepository.createQueryBuilder()
                    .relation(UserEntity, "roles")
                    .of(newUser)
                    .add(roles);
                await this.emailService.sendConfirmationEmail(newUser.id, newUser.email);
                return await this.getAccountInfo(newUser.email);
            } catch (error: any) {
                if (error.message == (ErrorEnum.USER_UNCONFIRMED.split(':'))[1]) {
                    throw new BusinessException(error.message);
                } else {
                    await this.userRepository.delete({ email: user.email })
                    throw new BusinessException(ErrorEnum.MISSION_EXECUTION_FAILED);
                }
            }
        }
    }
    async createWithGoogle(data: GoogleRedirectDto): Promise<Credential> {
        const { email } = data;
        if (await this.emailService.isCtuetEmail(email)) {
            const user = await this.findByEmail(email);
            if ((user && user.password) || user?.status == UserStatus.DISABLE) {
                throw new BusinessException(ErrorEnum.USER_EXISTS)
            };
            if (user?.status == UserStatus.UNACTIVE) {
                await this.updateStatus(user.id, UserStatus.ACTIVE)
            } else if (!user) {
                try {
                    delete data.accessToken;
                    const newUser = new UserEntity(data);
                    await this.userRepository.save(newUser);
                    await this.userRepository.createQueryBuilder()
                        .relation(UserEntity, "roles")
                        .of(newUser)
                        .add(UserRole.USER);
                    await this.updateStatus(newUser.id, UserStatus.ACTIVE)
                } catch (error: any) {
                    throw new BusinessException(ErrorEnum.MISSION_EXECUTION_FAILED);
                }
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
    async updateAccountInfo(id: number, data: UpdateUserDto): Promise<AccountInfo> {
        if (await this.findById(id)) {
            const user = await this.findById(id);
            if (user.status == UserStatus.ACTIVE) {
                await this.userRepository.update({ id: id }, data)
                return await this.getAccountInfo(user.email);
            }
            throw new BusinessException(ErrorEnum.USER_IS_BLOCKED);
        }
    }
    async update(id: number, data: UpdateAdminDto): Promise<UserEntity> {
        if (await this.findById(id)) {
            await this.userRepository.update({ id: id },
                {
                    firstName: data.firstName,
                    lastName: data.lastName,
                    phone: data.phone,
                    address: data.address,
                    status: data.status,
                })
            return await this.findById(id);
        }
    }
    async addPermission(data: AddPermissionDto) {
        if (await this.findById(data.uid)) {
            try {
                const role = await this.roleService.findById(data.rid);
                if (await this.roleService.checkUserHasRoleById(data.uid, data.rid))
                    throw new BusinessException("Permission already exist")
                const user = await this.findById(data.uid);
                await this.userRepository.createQueryBuilder()
                    .relation(UserEntity, "roles")
                    .of(user)
                    .add(role);
                return await this.findById(data.uid);
            } catch (error) {
                throw new BusinessException(ErrorEnum.ROLE_NOT_FOUND)
            }
        }
    }
    async updateUserPermission(uid: number, data: UpdatePermissionDto): Promise<UserEntity> {
        if (await this.findById(uid)) {
            const user = await this.findById(uid);
            const newRole = await this.roleService.findById(data.newRid);
            if (!(await this.roleService.checkUserHasRoleById(uid, data.oldRid)))
                throw new BusinessException(ErrorEnum.RECORD_NOT_FOUND)
            if (await this.roleService.checkUserHasRoleById(uid, data.newRid))
                throw new BusinessException("User has this role!")
            const userRoles = await this.roleService.getRolesByUser(uid);
            try {
                const updatedRoles = userRoles.map(role => role.id === data.oldRid ? newRole : role);
                await this.userRepository.createQueryBuilder()
                    .relation(UserEntity, "roles")
                    .of(user)
                    .addAndRemove(updatedRoles, userRoles);
                return await this.findById(uid);
            } catch (error) {
                throw new BusinessException(ErrorEnum.MISSION_EXECUTION_FAILED)
            }
        }
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
        const user = await this.findByEmail(email);
        if (!user || !user.password || user.status !== UserStatus.ACTIVE)
            throw new BusinessException(ErrorEnum.USER_INVALID)
        await this.userRepository.update({ email: email }, { password: password, repass_token: null })
        throw new BusinessException("Your password updated!")
    }
    async userConfirmation(dto: ConfirmationEmailDto) {
        const email = await this.emailService.confirmEmail(dto);
        if (email) {
            const user = await this.findByEmail(email);
            if (user.status == UserStatus.DISABLE)
                throw new BusinessException(ErrorEnum.USER_IS_BLOCKED);
            if (user.status == UserStatus.UNACTIVE) {
                await this.updateStatus(user.id, UserStatus.ACTIVE);
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
            if (error.message == 'jwt must be provided') {
                throw new BusinessException(ErrorEnum.INVALID_VERIFICATION_TOKEN)
            }
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }
    async resetPassword(email: string): Promise<any> {
        const isExisted = await this.findByEmail(email);
        if (!isExisted || !isExisted.password || isExisted.status !== UserStatus.ACTIVE) {
            throw new BusinessException(ErrorEnum.USER_INVALID)
        };
        try {
            const decoded = await this.jwtService.verifyAsync(isExisted.repass_token);
            if (decoded) {
                throw new BusinessException("Please, check your digital numbers in your email before!");
            };
        } catch (error) {
            const digitalNumbs = Math.floor((100000 + Math.random() * 900000));
            const payload = await this.emailService.sendConfirmationRePassword(email, digitalNumbs.toString());
            const repassToken = await this.jwtService.signAsync(payload);
            await this.updateRepassToken(email, repassToken);
            throw new BusinessException("The new digital numbers was send to your Email!");
        }
    }
    async updateStatus(id: number, status: number): Promise<UserEntity> {
        if (await this.findById(id)) {
            const user = await this.findById(id);
            await this.userRepository.update({ id: user.id }, { status: status })
            return await this.findById(user.id);
        }
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
                    const decode = await this.emailService.decodeConfirmationToken(user.refresh_token);
                    if (decode) {
                        throw new BusinessException("Please, click the link was send to your account before!")
                    }
                } catch (error: any) {
                    const token = await this.emailService.sendConfirmationEmail(user.id, user.email);
                    await this.userRepository.update({ email: dto.email }, { refresh_token: token })
                    throw new BusinessException("The confirmation email link already send");
                }
            }
            throw new BusinessException("Your account is confirmed!");
        }
        throw new BusinessException(ErrorEnum.USER_INVALID);
    }
}