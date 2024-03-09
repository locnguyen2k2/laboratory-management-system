import Mail from "nodemailer/lib/mailer";
import { JwtService } from "@nestjs/jwt";
import { createTransport } from "nodemailer";
import { JwtPayload } from "./../auth/interfaces/jwt.interface";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConfirmationEmailDto } from "../auth/dtos/confirmationEmail-auth.dto";

@Injectable()
export class EmailService {
    private nodeMailerTransport: Mail;
    constructor(
        private readonly jwtService: JwtService
    ) {
        this.nodeMailerTransport = createTransport({
            service: process.env.EMAIL_SERVICE,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });
    }

    async isCtuetEmail(email: string): Promise<boolean> {
        const emailHandle = email.split('@')[1];
        if (!(emailHandle.includes('ctuet.edu.vn'))) {
            throw new HttpException("This email must have the extension 'ctuet.edu.vn'!", HttpStatus.BAD_REQUEST);
        }
        return true;
    }

    async sendEmail(options: Mail.Options) {
        return this.nodeMailerTransport.sendMail(options);
    }

    async confirmEmail(dto: ConfirmationEmailDto) {
        try {
            const email = await this.decodeConfirmationToken(dto.token)
            if (email) {
                return email;
            }
        } catch (error) {
            throw new HttpException("Your token is invalid!", HttpStatus.BAD_REQUEST);
        }
    }

    async sendConfirmationEmail(id: number, email: string): Promise<string> {
        const payload: JwtPayload = { id: id, email: email };
        const token = this.jwtService.sign(payload);
        const url = `${process.env.EMAIL_CONFIRMATION_URL}?token=${token}`;
        const text = `Welcome to Laboratory Management System. To confirm the email address, click here: ${url}`;
        this.sendEmail({ to: email, subject: 'Email confirmation', text, })
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
                throw new HttpException("Email confirmation token expired", HttpStatus.BAD_REQUEST)
            }
            throw new HttpException("Bad confirmation token", HttpStatus.BAD_REQUEST)
        }

    }

}