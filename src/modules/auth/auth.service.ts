import * as bcrypt from 'bcryptjs';
import { AxiosResponse } from 'axios';
import { HttpService } from '@nestjs/axios';
import { UserService } from './../user/user.service';
import { Observable, lastValueFrom, map } from 'rxjs';
import { MailService } from './../email/mail.service';
import { JwtPayload } from './interfaces/jwt.interface';
import { UserStatus } from './../user/user.constant';
import { RegisterUserDto } from '../user/dtos/register.dto';
import { GoogleRedirectDto } from './dtos/googleRedirect-auth.dto';
import { RegisterAdminDto } from './../user/dtos/register.dto';
import { Injectable } from '@nestjs/common';
import { RegisterManagerDto } from './../user/dtos/register.dto';
import { JwtService } from '@nestjs/jwt';
import { Credential } from './interfaces/credential.interface';
import { BusinessException } from 'src/common/exceptions/biz.exception';
import { ErrorEnum } from 'src/constants/error-code.constant';
const _ = require('lodash');

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly emailService: MailService,
    private readonly httpService: HttpService,
  ) { }

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
          return {
            userInfo,
            access_token: user.token,
          };
        }
      } catch (error: any) {
        const payload: JwtPayload = {
          id: user.id,
          email: user.email,
        };
        const access_token = await this.jwtService.signAsync(payload);
        await this.userService.updateToken(payload.email, access_token);
        return {
          userInfo,
          access_token,
        };
      }
    }
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
      return error
      // throw new BusinessException(ErrorEnum.INVALID_VERIFICATION_TOKEN);
    }
  }

  async register(
    dto: RegisterUserDto | RegisterManagerDto | RegisterAdminDto,
    user: JwtPayload | null,
  ): Promise<any> {
    return await this.userService.create({
      ...dto,
      createBy: !_.isNil(user) ? user.id : null,
    });
  }
}
