import { Brackets, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateAdminDto, UpdateUserDto } from './dtos/update.dto';
import { MailService } from '../email/mail.service';
import { UserFilterDto, UserStatus } from './user.constant';
import { ForgotPasswordDto, PasswordUpdateDto } from './dtos/password.dto';
import { EmailLinkConfirmDto } from '../email/dtos/email-confirm.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfirmationEmailDto } from './dtos/confirmationEmail-auth.dto';
import { GoogleRedirectDto } from './../auth/dtos/googleRedirect-auth.dto';
import { AccountInfo } from './interfaces/AccountInfo.interface';
import { ErrorEnum } from 'src/constants/error-code.constant';
import { BusinessException } from 'src/common/exceptions/biz.exception';
import { Credential } from '../auth/interfaces/credential.interface';
import { IJwtPayload } from '../auth/interfaces/jwt.interface';
import { PageOptionsDto } from 'src/common/dtos/page-options.dto';
import { PageDto } from 'src/common/dtos/page.dto';
import { PageMetaDto } from 'src/common/dtos/page-meta.dto';
import { SortUserEnum } from './dtos/search-user.dto';
import { IRefreshToken } from '../auth/interfaces/refresh-token.interface';

const _ = require('lodash');
const bcrypt = require('bcryptjs');

@Injectable({})
export class UserService {
  constructor(
    private jwtService: JwtService,
    private readonly emailService: MailService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findAll(pageOptionsDto: UserFilterDto): Promise<PageDto<UserEntity>> {
    const user = this.userRepository.createQueryBuilder('user');

    if (pageOptionsDto.keyword) {
      user.andWhere(
        new Brackets((qb) => {
          qb.where('LOWER(user.firstName) LIKE LOWER(:keyword)', {
            keyword: `%${pageOptionsDto.keyword}%`,
          })
            .orWhere('LOWER(user.lastName) LIKE LOWER(:keyword)', {
              keyword: `%${pageOptionsDto.keyword}%`,
            })
            .orWhere('LOWER(user.address) LIKE LOWER(:keyword)', {
              keyword: `%${pageOptionsDto.keyword}%`,
            })
            .orWhere('LOWER(user.photo) LIKE LOWER(:keyword)', {
              keyword: `%${pageOptionsDto.keyword}%`,
            })
            .orWhere('LOWER(user.email) LIKE LOWER(:keyword)', {
              keyword: `%${pageOptionsDto.keyword}%`,
            })
            .orWhere('LOWER(user.status) LIKE LOWER(:keyword)', {
              keyword: `%${pageOptionsDto.keyword}%`,
            })
            .orWhere('LOWER(user.role) LIKE LOWER(:keyword)', {
              keyword: `%${pageOptionsDto.keyword}%`,
            });
        }),
      );
    }

    if (pageOptionsDto.status && pageOptionsDto.status.length > 0) {
      user.andWhere('user.status IN (:status)', {
        status: pageOptionsDto.status.map((value) => value + 1),
      });
    }

    if (pageOptionsDto.role && pageOptionsDto.role.length > 0) {
      user.andWhere('user.role IN (:role)', {
        role: pageOptionsDto.role.map((value) => value + 1),
      });
    }

    if (Object.values<string>(SortUserEnum).includes(pageOptionsDto.sort)) {
      user.orderBy(`user.${pageOptionsDto.sort}`, pageOptionsDto.order);
    } else {
      user.orderBy('user.createdAt', pageOptionsDto.order);
    }

    user
      .select([
        'user.id',
        'user.createBy',
        'user.updateBy',
        'user.firstName',
        'user.lastName',
        'user.address',
        'user.photo',
        'user.email',
        'user.status',
        'user.role',
        'user.createdAt',
        'user.updatedAt',
      ])
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);
    const numberRecords = await user.getCount();
    const { entities } = await user.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({ numberRecords, pageOptionsDto });
    return new PageDto(entities, pageMetaDto);
  }

  async findByEmail(email: string): Promise<UserEntity> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where({ email: email })
      .getOne();
    if (user) return user;
  }

  async findById(id: number): Promise<UserEntity> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where({ id: id })
      .getOne();
    if (user) return user;
    throw new BusinessException(ErrorEnum.USER_NOT_FOUND);
  }

  async updateAccountInfo(
    id: number,
    data: UpdateUserDto,
  ): Promise<AccountInfo> {
    if (await this.findById(id)) {
      const user = await this.findById(id);
      const info = {
        ...data,
        ...(data.firstName
          ? { firstName: data.firstName }
          : { firstName: user.firstName }),
        ...(data.lastName
          ? { lastName: data.lastName }
          : { lastName: user.lastName }),
        ...(data.address
          ? { address: data.address }
          : { address: user.address }),
      };
      if (user.status == UserStatus.ACTIVE) {
        await this.userRepository.update({ id: id }, info);
        return await this.getAccountInfo(user.email);
      }
      throw new BusinessException(ErrorEnum.USER_IS_BLOCKED);
    }
  }

  async update(
    id: number,
    dto: UpdateAdminDto,
    user: IJwtPayload,
  ): Promise<UserEntity> {
    const data = UpdateAdminDto.plainToClass(dto);
    if (await this.findById(id)) {
      const isExisted = await this.findById(id);

      const info = {
        ...data,
        ...(data.firstName
          ? { firstName: data.firstName }
          : { firstName: isExisted.firstName }),
        ...(data.photo && data.photo.length > 0
          ? { photo: data.photo }
          : { photo: isExisted.photo }),
        ...(data.lastName
          ? { lastName: data.lastName }
          : { lastName: isExisted.lastName }),
        ...(data.address
          ? { address: data.address }
          : { address: isExisted.address }),
        ...(data.status >= 0
          ? { status: data.status }
          : { status: isExisted.status }),
        ...(!_.isNil(data.status) && data.status !== UserStatus.ACTIVE
          ? { token: null, refresh_token: null }
          : { token: isExisted.token, refresh_token: isExisted.refresh_token }),
        ...(data.role >= 0 ? { role: data.role } : { role: isExisted.role }),
      };

      await this.userRepository.update(
        { id: id },
        {
          firstName: info.firstName,
          lastName: info.lastName,
          address: info.address,
          status: info.status,
          photo: info.photo,
          role: info.role,
          token: info.token,
          refresh_token: info.refresh_token,
          updateBy: user.id,
        },
      );
      return await this.findById(id);
    }
  }

  async updateStatusByUid(uid: number, status: UserStatus) {
    if (await this.findById(uid)) {
      if (status !== UserStatus.ACTIVE) {
        await this.userRepository.update(
          { id: uid },
          { status: status, token: null, refresh_token: null },
        );
      } else {
        await this.userRepository.update({ id: uid }, { status: status });
      }
    }
  }

  async create(user: any): Promise<any> {
    const { email, password } = user;

    if (await this.emailService.isCtuetEmail(email)) {
      const isExisted = await this.findByEmail(email);

      if (isExisted && isExisted.password) {
        throw new BusinessException(ErrorEnum.USER_EXISTS);
      }

      const newPassword = await bcrypt.hashSync(password, 10);

      if (isExisted) {
        await this.updatePassword(isExisted.email, newPassword);
        await this.updateStatusByUid(isExisted.id, UserStatus.UNACTIVE);

        const { id, status, role } = isExisted;
        const token = await this.emailService.sendConfirmationEmail(
          id,
          email,
          status,
          role,
        );

        await this.updateToken(isExisted.id, token);

        throw new BusinessException(
          'Confirm your account by the link was send to your email!',
        );
      }

      const newUser = new UserEntity({ ...user, password: newPassword });

      if (_.isNil(newUser.createBy)) {
        newUser.createBy = 0;
        newUser.updateBy = 0;
      } else {
        newUser.updateBy = newUser.createBy;
      }

      await this.userRepository.save(newUser);

      if (user.status != UserStatus.ACTIVE) {
        const { id, status, role } = newUser;

        const token = await this.emailService.sendConfirmationEmail(
          id,
          email,
          status,
          role,
        );

        await this.updateToken(id, token);

        throw new BusinessException(
          'Confirm your account by the link was send to your email!',
        );
      }

      return await this.findById(newUser.id);
    }
  }

  async generateRefreshToken(payload: IRefreshToken) {
    const refresh_token = this.jwtService.sign(payload, { expiresIn: '90d' });
    return await this.updateRefreshTokenByUid(payload.id, refresh_token);
  }

  async updateRefreshTokenByUid(uid: number, refresh_token: string) {
    if (await this.findById(uid)) {
      await this.userRepository.update(
        { id: uid },
        { refresh_token: refresh_token },
      );

      const hashedReToken = await bcrypt.hash(refresh_token, 10);
      return hashedReToken;
    }
  }

  async deleteToken(udi: number) {
    if (await this.findById(udi)) {
      await this.userRepository.update(
        { id: udi },
        { token: null, refresh_token: null },
      );

      return new BusinessException('200:Action success!');
    }
  }

  async createWithGoogle(data: GoogleRedirectDto): Promise<Credential> {
    const { email } = data;
    if (await this.emailService.isCtuetEmail(email)) {
      const user = await this.findByEmail(email);

      if (user?.status == UserStatus.DISABLE) {
        throw new BusinessException(ErrorEnum.USER_IS_BLOCKED);
      }
      if (user?.status == UserStatus.UNACTIVE) {
        delete user.status;
        await this.updateStatusByUid(user.id, UserStatus.ACTIVE);
      } else if (!user) {
        delete data.accessToken;
        const newUser = new UserEntity({ ...data, createBy: 0, updateBy: 0 });
        await this.userRepository.save(newUser);
        await this.updateStatusByUid(newUser.id, UserStatus.ACTIVE);
      }
      const userInfo = await this.findByEmail(email);
      const newUser = await this.findByEmail(email);

      try {
        const payload = await this.jwtService.verifyAsync(newUser.token);
        if (payload) {
          return {
            userInfo,
            access_token: newUser.token,
            refresh_token: newUser.refresh_token,
          };
        }
      } catch (error: any) {
        const payload: IJwtPayload = {
          id: newUser.id,
          email: newUser.email,
          status: newUser.status,
          role: newUser.role,
        };

        const access_token = await this.jwtService.signAsync(payload);
        const refresh_token = await this.generateRefreshToken({
          id: newUser.id,
          access_token,
        });

        await this.updateToken(newUser.id, access_token);
        return {
          userInfo,
          access_token,
          refresh_token,
        };
      }
    }
  }

  async updateToken(id: number, token: string): Promise<boolean> {
    if (await this.findById(id)) {
      await this.userRepository.update(
        { id },
        {
          token: token,
        },
      );
      return true;
    }
  }

  async updateRepassToken(email: string, repassToken: string) {
    const user = await this.findByEmail(email);
    if (!user || !user.password || user.status !== UserStatus.ACTIVE) {
      throw new BusinessException(ErrorEnum.USER_INVALID);
    }
    await this.userRepository.update(
      { email: email },
      { repass_token: repassToken },
    );
    return true;
  }

  async updatePassword(email: string, password: string) {
    if (this.emailService.isCtuetEmail(email)) {
      await this.userRepository.update(
        { email: email },
        { password: password, repass_token: null, token: null },
      );
    }
  }

  async userConfirmation(dto: ConfirmationEmailDto) {
    const email = await this.emailService.confirmEmail(dto);
    if (email) {
      const user = await this.findByEmail(email);
      if (user.status == UserStatus.DISABLE)
        throw new BusinessException(ErrorEnum.USER_IS_BLOCKED);
      if (user.status == UserStatus.UNACTIVE) {
        await this.updateStatusByUid(user.id, UserStatus.ACTIVE);
        await this.userRepository.update(
          { email: email },
          { refresh_token: null, token: null },
        );
        throw new BusinessException('Confirmation email is successful');
      }
      throw new BusinessException('This email is confirmed!');
    }
  }

  async confirmRePassword(data: ForgotPasswordDto) {
    if (this.emailService.isCtuetEmail(data.email)) {
      const isExisted = await this.findByEmail(data.email);
      if (
        !isExisted ||
        !isExisted.password ||
        isExisted.status !== UserStatus.ACTIVE
      ) {
        throw new BusinessException(ErrorEnum.USER_INVALID);
      }
      try {
        await this.jwtService.verifyAsync(isExisted.repass_token);
      } catch (error) {
        throw new BusinessException(ErrorEnum.INVALID_VERIFICATION_TOKEN);
      }
      const decoded = await this.jwtService.verifyAsync(isExisted.repass_token);
      if (data.digitalNumbs === decoded.digitalNumbs) {
        const isCheckPass = await bcrypt.compareSync(
          data.password,
          isExisted.password,
        );
        if (!isCheckPass) {
          const password = await bcrypt.hashSync(data.password, 10);
          await this.updatePassword(isExisted.email, password);
          await this.updateToken(isExisted.id, null);
          await this.updateRefreshTokenByUid(isExisted.id, null);
          return 'Your password is already updated';
        }
        throw new HttpException(
          'The password is duplicated',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        'Digital numbers incorrect',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async generateToken(email: string, refreshToken: string) {
    const user = await this.findByEmail(email);

    if (!user) throw new BusinessException(ErrorEnum.USER_NOT_FOUND);

    if (!user.refresh_token)
      throw new BusinessException(ErrorEnum.INVALID_VERIFICATION_TOKEN);

    const isMatch = await bcrypt.compareSync(user.refresh_token, refreshToken);
    if (isMatch) {
      try {
        const decoded = await this.jwtService.verifyAsync(user.refresh_token);
        if (decoded) {
          const tokenPayload: IJwtPayload = {
            id: user.id,
            status: user.status,
            role: user.role,
            email: user.email,
          };
          const newToken = this.jwtService.sign(tokenPayload);

          await this.updateToken(user.id, newToken);
          return { token: newToken };
        }
      } catch (error: any) {
        throw new BusinessException('400:Refresh token is expired');
      }
    }
    throw new BusinessException(ErrorEnum.INVALID_VERIFICATION_TOKEN);
  }

  async forgotPassword(email: string): Promise<any> {
    if (this.emailService.isCtuetEmail(email)) {
      const isExisted = await this.findByEmail(email);
      if (!isExisted || isExisted.status !== UserStatus.ACTIVE) {
        throw new BusinessException(ErrorEnum.USER_INVALID);
      }
      try {
        await this.jwtService.verifyAsync(isExisted.repass_token);
      } catch (error) {
        const digitalNumbs = Math.floor(100000 + Math.random() * 900000);
        const payload = await this.emailService.sendConfirmationRePassword(
          email,
          digitalNumbs.toString(),
        );
        const repassToken = await this.jwtService.signAsync(payload);
        await this.updateRepassToken(email, repassToken);
        throw new BusinessException(
          'The new digital numbers was send to your Email!',
        );
      }
      const decoded = await this.jwtService.verifyAsync(isExisted.repass_token);
      if (decoded) {
        throw new BusinessException(
          'Please, check your digital numbers in your email before!',
        );
      }
    }
  }

  async getAccountInfo(email: string): Promise<AccountInfo> {
    const user = await this.findByEmail(email);
    if (!user || user.status == UserStatus.DISABLE) {
      throw new BusinessException(ErrorEnum.USER_IS_BLOCKED);
    }
    if (user.status == UserStatus.UNACTIVE) {
      throw new BusinessException(ErrorEnum.USER_UNCONFIRMED);
    }
    delete user.token;
    delete user.password;
    delete user.repass_token;
    delete user.refresh_token;
    return user;
  }

  async resendConfirmationLink(dto: EmailLinkConfirmDto) {
    if (await this.emailService.isCtuetEmail(dto.email)) {
      const user = await this.findByEmail(dto.email);

      if (user && user.status !== UserStatus.DISABLE) {
        if (user.status == UserStatus.UNACTIVE) {
          try {
            await this.emailService.decodeConfirmationToken(user.token);
          } catch (error: any) {
            const { id, email, status, role } = user;
            const token = await this.emailService.sendConfirmationEmail(
              id,
              email,
              status,
              role,
            );
            await this.userRepository.update({ email }, { token });
            throw new BusinessException(
              'The confirmation email link already send',
            );
          }
          const decode = await this.emailService.decodeConfirmationToken(
            user.token,
          );
          if (decode) {
            throw new BusinessException(
              'Please, click the link was send to your account before!',
            );
          }
        }
        throw new BusinessException('Your account is confirmed!');
      }
      throw new BusinessException(ErrorEnum.USER_INVALID);
    }
  }

  async resetPassword(id: number, data: PasswordUpdateDto) {
    const user = await this.findById(id);
    const isTrue = await bcrypt.compareSync(data.oldPassword, user.password);
    if (isTrue) {
      const newPassword = await bcrypt.hashSync(data.newPassword, 10);
      await this.userRepository.update(id, { password: newPassword });
      throw new BusinessException('The password is changed');
    }
    throw new BusinessException('400:Old password is incorrect!');
  }

  async deleteById(uid: number) {
    const user = await this.findById(uid);
    if (user) {
      try {
        await this.userRepository.delete(user.id);
        return await this.findAll(new PageOptionsDto());
      } catch (error: any) {
        throw new BusinessException(ErrorEnum.ITEM_IN_USED);
      }
    }
  }
}
