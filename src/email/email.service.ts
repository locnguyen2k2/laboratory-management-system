import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { createTransport } from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import { UserStatusEnum } from "src/auth/enums/user-status.enum";
import { JwtPayload } from "src/auth/interfaces/jwt.interface";
import { UserService } from "src/user/user.service";

@Injectable()
export class EmailService {
    private nodeMailerTransport: Mail;
    constructor(
        private readonly userService: UserService,
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

    async sendConfirmationEmail(email: string) {
        const user = await this.userService.findByEmail(email)
        if (!user) {
            throw new HttpException({ message: "The email not found", status: 404 }, HttpStatus.ACCEPTED);
        }
        const payload: JwtPayload = { id: user.id, email: user.email };
        const token = this.jwtService.sign(payload);
        const url = `${process.env.EMAIL_CONFIRMATION_URL}?token=${token}`;
        const text = `Welcome to Laboratory Management System. To confirm the email address, click here: ${url}`;
        return this.sendEmail({
            to: email,
            subject: 'Email confirmation',
            text,
        })
    }

    async sendConfirmationRePassword(email: string, digitalNumbs: string) {
        const user = await this.userService.findByEmail(email)
        if (!user) {
            throw new HttpException({ message: "The email not found", status: 404 }, HttpStatus.ACCEPTED);
        }
        const text = `Your digital numbers to confirm reset password, here: ${digitalNumbs}`;
        this.sendEmail({
            to: email,
            subject: 'Reset Password confirmation. Do not show your digital numbers to another!',
            text,
        })
        return { digitalNumbs: digitalNumbs };
    }

    async confirmEmail(email: string) {
        const user = await this.userService.findByEmail(email);
        if (!user) {
            throw new HttpException("Email not found", HttpStatus.NOT_FOUND);
        };
        if (user.status === UserStatusEnum.ACTIVE) {
            return "User is already confirmed";
        };
        await this.userService.disable(email, UserStatusEnum.ACTIVE);
        return "Confirmation email is successful";
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

    async resendConfirmationLink(email: string) {
        const user = await this.userService.findByEmail(email);
        if (!user) {
            throw new HttpException("The email not found", HttpStatus.NOT_FOUND);
        }
        if (user.status === UserStatusEnum.ACTIVE) {
            return "Email is already confirmed";
        }
        await this.sendConfirmationEmail(user.email);
        return "The confirmation email link already send";
    }
}