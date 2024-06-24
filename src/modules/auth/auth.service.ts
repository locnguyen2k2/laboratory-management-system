import * as bcrypt from 'bcryptjs';
import { AxiosResponse } from 'axios';
import { HttpService } from '@nestjs/axios';
import { UserService } from './../user/user.service';
import { lastValueFrom, map, Observable } from 'rxjs';
import { MailService } from './../email/mail.service';
import { IJwtPayload } from './interfaces/jwt.interface';
import { UserStatus } from './../user/user.constant';
import { RegisterUserDto } from '../user/dtos/register.dto';
import { GoogleRedirectDto } from './dtos/googleRedirect-auth.dto';
import {
  RegisterAdminDto,
  RegisterManagerDto,
} from './../user/dtos/register.dto';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Credential } from './interfaces/credential.interface';
import { BusinessException } from 'src/common/exceptions/biz.exception';
import { ErrorEnum } from 'src/constants/error-code.constant';
import { ReqReTokenDto } from './dtos/request-auth.dto';

const _ = require('lodash');

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly emailService: MailService,
    private readonly httpService: HttpService,
  ) {}

  async credentialByPassword(
    email: string,
    password: string,
  ): Promise<Credential> {
    if (await this.emailService.isCtuetEmail(email)) {
      const user = await this.userService.findByEmail(email);
      if (
        !user ||
        !user?.password ||
        !(await bcrypt.compareSync(password, user?.password))
      ) {
        throw new BusinessException(ErrorEnum.INVALID_LOGIN);
      }
      if (user.status == UserStatus.DISABLE) {
        throw new BusinessException(ErrorEnum.USER_IS_BLOCKED);
      }
      if (user.status == UserStatus.UNACTIVE) {
        throw new BusinessException(ErrorEnum.USER_UNCONFIRMED);
      }
      const userInfo = await this.userService.getAccountInfo(email);

      try {
        if (await this.jwtService.verifyAsync(user.token)) {
          const refresh_token = await this.userService.generateRefreshToken({
            id: user.id,
            access_token: user.token,
          });
          return {
            userInfo,
            access_token: user.token,
            refresh_token,
          };
        }
      } catch (error: any) {
        const payload: IJwtPayload = {
          id: user.id,
          email: user.email,
          status: user.status,
          role: user.role,
        };
        const access_token = this.jwtService.sign(payload);
        await this.userService.updateToken(user.id, access_token);

        const refresh_token = await this.userService.generateRefreshToken({
          id: payload.id,
          access_token,
        });

        return {
          userInfo,
          access_token,
          refresh_token,
        };
      }
    }
  }

  async logout(uid: number) {
    return await this.userService.deleteToken(uid);
  }

  async getNewToken(data: ReqReTokenDto) {
    return await this.userService.generateToken(data.email, data.refreshToken);
  }

  async ggAccessTokenVerify(
    accessToken: string,
  ): Promise<Observable<AxiosResponse<any, any>>> {
    return lastValueFrom(
      this.httpService
        .get(
          `https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${accessToken}`,
        )
        .pipe(map((res) => res.data)),
    );
  }

  async credentialWithoutPassword(data: GoogleRedirectDto): Promise<any> {
    try {
      const isVerifyToken = await this.ggAccessTokenVerify(
        data.accessToken,
      ).then((res: any) => res);
      if (isVerifyToken && isVerifyToken.email == data.email) {
        return await this.userService.createWithGoogle(data);
      }
      throw new BusinessException(ErrorEnum.INVALID_VERIFICATION_TOKEN);
    } catch (error) {
      throw new BusinessException(ErrorEnum.INVALID_VERIFICATION_TOKEN);
    }
  }

  async register(
    dto: RegisterUserDto | RegisterManagerDto | RegisterAdminDto,
    user: IJwtPayload | null,
  ): Promise<any> {
    return await this.userService.create({
      ...dto,
      createBy: !_.isNil(user) ? user.id : null,
    });
  }
}
