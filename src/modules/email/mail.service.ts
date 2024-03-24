import Mail from "nodemailer/lib/mailer";
import { JwtService } from "@nestjs/jwt";
import { createTransport } from "nodemailer";
import { JwtPayload } from "./../auth/interfaces/jwt.interface";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConfirmationEmailDto } from "../user/dtos/confirmationEmail-auth.dto";
import { BusinessException } from "src/common/exceptions/biz.exception";
import { ErrorEnum } from "src/constants/error-code.constant";

@Injectable()
export class MailService {
    private nodeMailerTransport: Mail;
    constructor(
        private readonly jwtService: JwtService
    ) {
        this.nodeMailerTransport = createTransport({
            service: process.env.EMAIL_SERVICE,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            },
        });
    }

    async isCtuetEmail(email: string): Promise<boolean | HttpException> {
        const emailHandle = email.split('@')[1];
        if (!(emailHandle.includes('ctuet.edu.vn'))) {
            throw new BusinessException(ErrorEnum.CTUET_EMAIL);
        }
        return true;
    }

    async sendEmail(options: Mail.Options): Promise<any> {
        return this.nodeMailerTransport.sendMail(options, (err, info) => { console.log(err, info) });
    }

    async confirmEmail(dto: ConfirmationEmailDto) {
        try {
            const email = await this.decodeConfirmationToken(dto.token)
            if (email) {
                return email;
            }
        } catch (error) {
            throw new BusinessException(ErrorEnum.INVALID_VERIFICATION_TOKEN);
        }
    }

    async sendConfirmationEmail(id: number, email: string): Promise<string> {
        const payload: JwtPayload = { id: id, email: email };
        const token = this.jwtService.sign(payload);
        const url = `${process.env.EMAIL_CONFIRMATION_URL}?token=${token}`;
        const text = `Welcome to Laboratory Management System. To confirm the email address, click here: ${url}`;
        await this.sendEmail({ to: email, subject: 'Email confirmation', text })
        return token;
    }

    async sendConfirmationRePassword(email: string, digitalNumbs: string) {
        const text = `Your digital numbers to confirm reset password, here: ${digitalNumbs}`;
        try {
            this.sendEmail({
                to: email,
                subject: 'Reset Password confirmation. Do not show your digital numbers to another!',
                text,
            })
            return { digitalNumbs: digitalNumbs };
        } catch (error) {
            return error;
        }
    }

    async decodeConfirmationToken(token: string) {
        try {
            const payload: JwtPayload = this.jwtService.verify(token);
            if (typeof payload === 'object' && 'email' in payload) {
                return payload.email
            }
        } catch (error) {
            if (error?.name === 'TokenExpiredError') {
                throw new BusinessException(ErrorEnum.INVALID_VERIFICATION_TOKEN)
            }
            throw new BusinessException(ErrorEnum.INVALID_VERIFICATION_TOKEN)
        }

    }

}