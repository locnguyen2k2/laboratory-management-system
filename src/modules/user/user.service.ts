import * as bcrypt from 'bcryptjs'
import { Repository } from "typeorm";
import { UserEntity } from "./user.entity";
import { plainToClass } from "class-transformer";
import { InjectRepository } from "@nestjs/typeorm";
import { UpdatePermissionDto, UpdateUserDto } from "./dtos/update.dto";
import { UpdateAdminDto } from "./dtos/update.dto";
import { UserRole, UserStatus } from "./user.constant";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { GoogleRedirectDto } from "./../auth/dtos/googleRedirect-auth.dto";
import { MailService } from '../email/mail.service';
import { JwtService } from '@nestjs/jwt';
import { ForgotPasswordDto } from './dtos/password.dto';
import { ConfirmationEmailDto } from './dtos/confirmationEmail-auth.dto';
import { EmailLinkConfirmDto } from '../email/dtos/email-confirm.dto';
import { RoleService } from '../system/role/role.service';

@Injectable({})
export class UserService {
    constructor(
        private jwtService: JwtService,
        private readonly roleService: RoleService,
        private readonly emailService: MailService,
        @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
    ) { }
    async findAll() {
        let listUser = await this.userRepository.
            createQueryBuilder('user')
            .leftJoinAndSelect('user.roles', 'roles')
            .getMany();
        listUser.forEach((item: any) => {
            delete item.password,
                delete item.token,
                delete item.repass_token,
                delete item.refresh_token;
        })
        return listUser;
    }
    async findByEmail(email: string) {
        return await this.userRepository
            .createQueryBuilder('user')
            .where({ email: email })
            .leftJoinAndSelect('user.roles', 'roles')
            .getOne()
    }
    async findById(id: number) {
        const user = await this.userRepository
            .createQueryBuilder('user')
            .where({ id: id })
            .leftJoinAndSelect('user.roles', 'roles')
            .getOne()
        if (user) {
            delete user.token;
            delete user.password;
            delete user.repass_token;
            delete user.refresh_token;
            return user
        }
        throw new HttpException("User not found!", HttpStatus.NOT_FOUND);
    }
    async create(user: any) {
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
                return "Your account is created successfully!";
            } catch (error) {
                return error;
            }
        }
    }
    async createWithGoogle(data: GoogleRedirectDto) {
        if (await this.emailService.isCtuetEmail(data.email)) {
            const user = await this.findByEmail(data.email);
            if (user && user.password || user.status !== UserStatus.ACTIVE) {
                throw new HttpException("Email is existed or blocked", HttpStatus.BAD_REQUEST)
            };
            if (!user) {
                let newData = plainToClass(GoogleRedirectDto, data, { excludeExtraneousValues: true });
                try {

                    const newUser = new UserEntity(newData);
                    await this.userRepository.save(newUser);
                    await this.userRepository.createQueryBuilder()
                        .relation(UserEntity, "roles")
                        .of(newUser)
                        .add(UserRole.USER);
                    const user = await this.findByEmail(newUser.email);
                    await this.updateStatus(user.id, UserStatus.ACTIVE)
                } catch (error) {
                    return error
                }
            }
            return true;
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
    async updateAccountInfo(email: string, data: UpdateUserDto): Promise<any> {
        const user = await this.findByEmail(email);
        if (user && user.status == UserStatus.ACTIVE) {
            const updateInfo = plainToClass(UpdateUserDto, data, { excludeExtraneousValues: true });
            await this.userRepository.update({ email: email }, updateInfo)
            return updateInfo
        }
        throw new HttpException("User not found or blocked", HttpStatus.NOT_FOUND);
    }
    async update(id: number, data: UpdateAdminDto, email: string): Promise<any> {
        const user = await this.findByEmail(email);
        if (user && user.status == UserStatus.ACTIVE) {
            const roles = await this.roleService.getRoleByUserId(user.id);
            if (await this.roleService.hasAdminRole(roles)) {
                if (await this.findById(id)) {
                    const updateInfo = plainToClass(UpdateAdminDto, data, { excludeExtraneousValues: true })
                    await this.userRepository.update({ id: id },
                        {
                            firstName: updateInfo.firstName,
                            lastName: updateInfo.lastName,
                            phone: updateInfo.phone,
                            address: updateInfo.address,
                            status: updateInfo.status,
                        })
                    return updateInfo;
                }
                throw new HttpException("Email not found", HttpStatus.BAD_REQUEST);
            }
            throw new HttpException("Access was denied!", HttpStatus.BAD_REQUEST);
        }
        throw new HttpException("User not found, bolcked!", HttpStatus.NOT_FOUND);
    }
    async updateUserPermission(uid: number, data: UpdatePermissionDto) {
        const user = await this.findById(uid);
        if (user) {
            const updateInfo = plainToClass(UpdatePermissionDto, data, { excludeExtraneousValues: true });
            const oldRole = await this.roleService.findById(updateInfo.oldRid);
            const newRole = await this.roleService.findById(updateInfo.newRid);
            if (!oldRole || !newRole) {
                throw new HttpException("Role not found!", HttpStatus.BAD_REQUEST)
            }
            if (!(await this.roleService.checkUserHasRoleById(uid, updateInfo.oldRid))) {
                throw new HttpException("User's role not found!", HttpStatus.BAD_REQUEST)
            }
            if (await this.roleService.checkUserHasRoleById(uid, updateInfo.newRid)) {
                throw new HttpException("User has this role!", HttpStatus.BAD_REQUEST)
            }
            const userRoles = await this.roleService.getRolesByUser(uid);

            try {
                const updatedRoles = userRoles.map(role => role.id === updateInfo.oldRid ? newRole : role);
                await this.userRepository.createQueryBuilder()
                    .relation(UserEntity, "roles")
                    .of(user)
                    .addAndRemove(updatedRoles, userRoles);
                return await this.findById(uid);
            } catch (error) {
                return error
            }
        }
        throw new HttpException("User not found!", HttpStatus.NOT_FOUND);
    }
    async updateRepassToken(email: string, repassToken: string) {
        const user = await this.findByEmail(email);
        if (user && user.status == UserStatus.ACTIVE) {
            await this.userRepository.update({ email: email }, { repass_token: repassToken, })
            return true;
        };
        throw new HttpException('User not found or blocked', HttpStatus.NOT_FOUND);
    }
    async updatePassword(email: string, password: string) {
        const user = await this.findByEmail(email);
        if (user && user.status == UserStatus.ACTIVE) {
            await this.userRepository.update({ email: email }, { password: password })
            return "Your password updated!"
        };
        throw new HttpException('User not found or blocked', HttpStatus.NOT_FOUND);
    }
    async userConfirmation(dto: ConfirmationEmailDto) {
        const email = await this.emailService.confirmEmail(dto);
        if (email) {
            const user = await this.findByEmail(email);
            if (user.status == UserStatus.DISABLE) {
                throw new HttpException("Your account is blocked", HttpStatus.BAD_REQUEST);
            }
            if (user.status == UserStatus.UNACTIVE) {
                await this.updateStatus(user.id, UserStatus.ACTIVE);
                await this.userRepository.update({ email: email }, { refresh_token: null, })
                return "Your account is confirmation!"
            }
            throw new HttpException("The email is confirmeation!", HttpStatus.ACCEPTED)
        }
    }
    async confirmRePassword(data: ForgotPasswordDto) {
        const isExisted = await this.findByEmail(data.email);
        if (!isExisted || !isExisted.password || isExisted.status !== UserStatus.ACTIVE) {
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
        if (!isExisted || !isExisted.password || isExisted.status !== UserStatus.ACTIVE) {
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
    async updateStatus(id: number, status: UserStatus) {
        const user = await this.findById(id);
        if (user) {
            await this.userRepository.update({ email: user.email }, { status: status })
            return true
        }
        throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
    }
    async getAccountInfo(email: string): Promise<any> {
        let user = await this.findByEmail(email)
        if (!user || user.status !== UserStatus.ACTIVE) {
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
        if (user && user.status !== UserStatus.DISABLE) {
            if (user.status == UserStatus.UNACTIVE) {
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
        throw new HttpException("User is not existed or blocked!", HttpStatus.BAD_REQUEST);
    }
}