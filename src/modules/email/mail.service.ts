import Mail from 'nodemailer/lib/mailer';
import { JwtService } from '@nestjs/jwt';
import { createTransport } from 'nodemailer';
import { IJwtPayload } from './../auth/interfaces/jwt.interface';
import { HttpException, Injectable } from '@nestjs/common';
import { ConfirmationEmailDto } from '../user/dtos/confirmationEmail-auth.dto';
import { BusinessException } from 'src/common/exceptions/biz.exception';
import { ErrorEnum } from 'src/constants/error-code.constant';
import { IRefreshToken } from '../auth/interfaces/refresh-token.interface';

@Injectable()
export class MailService {
  private nodeMailerTransport: Mail;

  constructor(private readonly jwtService: JwtService) {
    this.nodeMailerTransport = createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async isCtuetEmail(email: string): Promise<boolean | HttpException> {
    const teacherEmail = await this.isTeacherCtutEmail(email);
    const studentEmail = await this.isStudentCtuetEmail(email);
    if (!teacherEmail && !studentEmail) {
      throw new BusinessException(ErrorEnum.CTUET_EMAIL);
    }
    return true;
  }

  async isStudentCtuetEmail(email: string) {
    let studentEmail = '';
    for (let i = email.length - 21; i < email.length; i++) {
      studentEmail += email[i];
    }
    return studentEmail == '@student.ctuet.edu.vn' ? true : false;
  }

  async isTeacherCtutEmail(email: string) {
    let teacherEmail = '';
    for (let i = email.length - 13; i < email.length; i++) {
      teacherEmail += email[i];
    }
    return teacherEmail == '@ctuet.edu.vn' ? true : false;
  }

  async sendEmail(options: Mail.Options): Promise<any> {
    return this.nodeMailerTransport.sendMail(options);
  }

  async confirmEmail(dto: ConfirmationEmailDto) {
    try {
      const email = await this.decodeConfirmationToken(dto.token);
      if (email) {
        return email;
      }
    } catch (error) {
      throw new BusinessException(ErrorEnum.INVALID_VERIFICATION_TOKEN);
    }
  }

  async sendConfirmationEmail(
    id: number,
    email: string,
    status: number,
    role: number,
  ): Promise<string> {
    const payload: IJwtPayload = { id, email, status, role };
    const token = this.jwtService.sign(payload);
    const url = `${process.env.EMAIL_CONFIRMATION_URL}?token=${token}`;
    const text = `Welcome to Laboratory Management System. To confirm the email address, click here: ${url}`;

    await this.sendEmail({ to: email, subject: 'Email confirmation', text });

    return token;
  }

  async sendConfirmationRePassword(email: string, digitalNumbs: string) {
    const text = `Your digital numbers to confirm reset password, here: ${digitalNumbs}`;
    try {
      this.sendEmail({
        to: email,
        subject:
          'Reset Password confirmation. Do not show your digital numbers to another!',
        text,
      });
      return { digitalNumbs: digitalNumbs };
    } catch (error) {
      return error;
    }
  }

  async decodeReToken(refreshToken: string): Promise<IRefreshToken> {
    try {
      const payload: IRefreshToken = this.jwtService.verify(refreshToken);
      if (typeof payload === 'object' && 'id' in payload) {
        return payload;
      }
    } catch (error) {
      if (error?.name === 'TokenExpiredError') {
        throw new BusinessException(ErrorEnum.INVALID_VERIFICATION_TOKEN);
      }
      throw new BusinessException(ErrorEnum.INVALID_VERIFICATION_TOKEN);
    }
  }

  async decodeConfirmationToken(token: string) {
    try {
      const payload: IJwtPayload = this.jwtService.verify(token);
      if (typeof payload === 'object' && 'email' in payload) {
        return payload.email;
      }
    } catch (error) {
      if (error?.name === 'TokenExpiredError') {
        throw new BusinessException(ErrorEnum.INVALID_VERIFICATION_TOKEN);
      }
      throw new BusinessException(ErrorEnum.INVALID_VERIFICATION_TOKEN);
    }
  }
}
